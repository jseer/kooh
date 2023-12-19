export interface IHookFn {
  (...arg: any[]): Promise<any> | void;
}

export enum IHookTypes {
  sync = "sync",
  syncBail = "sync-bail",
  syncWaterfall = "sync-waterfall",
  asyncSeries = "async-series",
  asyncSeriesBail = "async-series-bail",
  asyncSeriesWaterfall = "async-series-waterfall",
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

  callHooks(name: T, args: any[]) {
    const hooks = this._hooks[name] || [];
    switch (this._hookTypes[name]) {
      case IHookTypes.asyncSeries:
        return this.asyncSeries.call(this, hooks, args);
      case IHookTypes.asyncSeriesBail:
        return this.asyncSeriesBail.call(this, hooks, args);
      case IHookTypes.asyncSeriesWaterfall:
        return this.asyncSeriesWaterfall.call(this, hooks, args);
      case IHookTypes.asyncParallel:
        return this.asyncParallel.call(this, hooks, args);
      case IHookTypes.syncWaterfall:
        return this.syncWaterfall.call(this, hooks, args);
      case IHookTypes.syncBail:
        return this.syncBail.call(this, hooks, args);
      case IHookTypes.sync:
      default:
        return this.sync.call(this, hooks, args);
    }
  }

  sync(hooks: IHookInfo[], args: any[]) {
    return hooks.forEach((hook) => {
      hook.fn!.apply(hook.context || hook, args);
    });
  }
  syncBail(hooks: IHookInfo[], args: any[]) {
    for (let hook of hooks) {
      const result = hook.fn!.apply(hook.context || hook, args);
      if (result) {
        return result;
      }
    }
  }
  syncWaterfall(hooks: IHookInfo[], args: any[]) {
    return hooks.reduce((arg, hook) => {
      return hook.fn!.apply(hook.context || hook, arg);
    }, args[0]);
  }
  asyncSeries(hooks: IHookInfo[], args: any[]) {
    return hooks.reduce((promise, hook) => {
      return promise.then(() => hook.fn!.apply(hook.context || hook, args));
    }, Promise.resolve());
  }
  async asyncSeriesBail(hooks: IHookInfo[], args: any[]) {
    for (let hook of hooks) {
      const result = await hook.fn!.apply(hook.context || hook, args);
      if (result) {
        return result;
      }
    }
  }
  asyncSeriesWaterfall(hooks: IHookInfo[], args: any[]) {
    return hooks.reduce((promise, hook) => {
      return promise.then((arg) => hook.fn!.apply(hook.context || hook, arg));
    }, Promise.resolve(args[0]));
  }
  asyncParallel(hooks: IHookInfo[], args: any[]) {
    return Promise.all(
      hooks.map((hook) => hook.fn!.apply(hook.context || hook, args))
    );
  }
}
