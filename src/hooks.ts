export interface IHookFn {
  (...arg: any[]): Promise<any> | void;
}

export enum IHookTypes {
  sync = "sync",
  syncBail = "sync-bail",
  syncWaterfall = "sync-waterfall",
  syncAddWaterfall = "sync-add-waterfall",
  asyncSeries = "async-series",
  asyncSeriesBail = "async-series-bail",
  asyncSeriesWaterfall = "async-series-waterfall",
  asyncSeriesAddWaterfall = "async-series-add-waterfall",
  asyncParallel = "async-parallel",
}

interface IHookInfo {
  context?: any;
  fn?: IHookFn;
  [key: string]: any;
}

export class Hooks<T extends string> {
  constructor(
    private _hookTypes: Record<T, IHookTypes> = {} as Record<T, IHookTypes>,
    private _hooks: Record<T, IHookInfo[]> = {} as Record<T, IHookInfo[]>
  ) {
    this._hookTypes = _hookTypes;
    this._hooks = _hooks;
  }

  add(name: T, fn: IHookFn | IHookInfo, opts: IHookInfo = {}) {
    if (typeof fn === "function") {
      opts.fn = fn;
    } else {
      opts = fn || {};
      if (typeof opts.fn !== "function") {
        throw new Error("must be add a hook fn");
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(opts);
    return () => {
      this.remove(name, opts.fn!);
    };
  }

  remove(name: T, fn: IHookFn) {
    if (this._hooks[name]) {
      const index = this._hooks[name].findIndex((info) => info.fn === fn);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }

  call(name: T, ...args: any[]) {
    return this.callHooks.call(this, name, args);
  }

  private callHooks(name: T, args: any[]) {
    const hooks = this._hooks[name] || [];
    switch (this._hookTypes[name]) {
      case IHookTypes.asyncSeries:
        return this.asyncSeries.call(this, hooks, args);
      case IHookTypes.asyncSeriesBail:
        return this.asyncSeries.call(this, hooks, args, { bail: true });
      case IHookTypes.asyncSeriesWaterfall:
        return this.asyncSeriesWaterfall.call(this, hooks, args);
      case IHookTypes.asyncSeriesAddWaterfall:
        return this.asyncSeriesWaterfall.call(this, hooks, args, { add: true });
      case IHookTypes.asyncParallel:
        return this.asyncParallel.call(this, hooks, args);
      case IHookTypes.syncWaterfall:
        return this.syncWaterfall.call(this, hooks, args);
      case IHookTypes.syncAddWaterfall:
        return this.syncWaterfall.call(this, hooks, args, { add: true });
      case IHookTypes.syncBail:
        return this.sync.call(this, hooks, args, {
          bail: true,
        });
      case IHookTypes.sync:
      default:
        return this.sync.call(this, hooks, args);
    }
  }

  private sync(hooks: IHookInfo[], args: any[], opts: { bail?: boolean } = {}) {
    const { bail } = opts;
    let result;
    for (let hook of hooks) {
      result = hook.fn!.apply(hook.context, args);
      if (bail && result) {
        return result;
      }
    }
  }

  private syncWaterfall(
    hooks: IHookInfo[],
    args: any[],
    opts: { add?: boolean } = {}
  ) {
    const { add } = opts;
    const [result, ...rest] = args;
    const addedFn = this.getAddedFn(result, add);
    return hooks.reduce(
      (result, hook) =>
        addedFn(result, hook.fn!.call(hook.context, result, ...rest)),
      result
    );
  }

  private async asyncSeries(
    hooks: IHookInfo[],
    args: any[],
    opts: { bail?: boolean } = {}
  ) {
    const { bail } = opts;
    let result;
    for (let hook of hooks) {
      result = await hook.fn!.apply(hook.context, args);
      if (bail && result) {
        return result;
      }
    }
  }

  private asyncSeriesWaterfall(
    hooks: IHookInfo[],
    args: any[],
    opts: { add?: boolean } = {}
  ) {
    const { add } = opts;
    const [result, ...rest] = args;
    const addedFn = this.getAddedFn(result, add);
    return hooks.reduce(
      (promise, hook) =>
        promise.then(async (result) =>
          addedFn(result, await hook.fn!.call(hook.context, result, ...rest))
        ),
      Promise.resolve(result)
    );
  }

  private asyncParallel(hooks: IHookInfo[], args: any[]) {
    return Promise.all(hooks.map((hook) => hook.fn!.apply(hook.context, args)));
  }

  private getAddedFn(result: any, isAdd: boolean = true) {
    if (isAdd) {
      if (Array.isArray(result)) {
        return (result: any, hookRes: any) => result.concat(hookRes);
      } else if (result && typeof result === "object") {
        return (result: any, hookRes: any) => Object.assign(result, hookRes);
      }
    }
    return (hookRes: any) => hookRes;
  }
}
