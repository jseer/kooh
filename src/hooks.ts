interface IHookFn {
  (...arg: any[]): Promise<any> | void;
}

export enum IHookTypes {
  sync = "sync",
  syncWaterfall = "sync-waterfall",
  asyncSeries = "async-series",
  asyncSeriesWaterfall = "async-series-waterfall",
  asyncParallel = "async-parallel",
}

export class Hooks {
  constructor(
    private _hookTypes: Record<string, IHookTypes> = {},
    private _hooks: Record<string, IHookFn[]> = {}
  ) {
    this._hookTypes = _hookTypes;
    this._hooks = _hooks;
  }

  add(name: string, fn: IHookFn) {
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(fn);
    return () => {
      if (fn) {
        this.remove(name, fn);
      }
    };
  }

  remove(name: string, fn: IHookFn) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(fn);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }

  call(name: string, ...args: any) {
    if (!this._hooks[name]) {
      throw new Error("no hooks will be call");
    }
    return this.callHooks.call(this, name, args);
  }

  callHooks(name: string, args: any) {
    const hooks = this._hooks[name];
    switch (this._hookTypes[name]) {
      case IHookTypes.asyncSeries:
        return this.asyncSeries.call(this, hooks, args);
      case IHookTypes.asyncSeriesWaterfall:
        return this.asyncSeriesWaterfall.call(this, hooks, args);
      case IHookTypes.asyncParallel:
        return this.asyncParallel.call(this, hooks, args);
      case IHookTypes.syncWaterfall:
        return this.syncWaterfall.call(this, hooks, args);
      case IHookTypes.sync:
      default:
        return this.sync.call(this, hooks, args);
    }
  }

  sync(hooks: IHookFn[], args: any) {
    return hooks.forEach((hook) => {
      hook.apply(hooks, args);
    });
  }
  syncWaterfall(hooks: IHookFn[], args: any) {
    return hooks.reduce((args, hook) => {
      return hook.apply(hooks, args);
    }, args);
  }
  asyncSeries(hooks: IHookFn[], args: any) {
    return hooks.reduce((promise, hook) => {
      return promise.then(() => hook.apply(hooks, args));
    }, Promise.resolve());
  }
  asyncSeriesWaterfall(hooks: IHookFn[], args: any) {
    return hooks.reduce((promise, hook) => {
      return promise.then((args) => hook.apply(hooks, args));
    }, Promise.resolve(args));
  }
  asyncParallel(hooks: IHookFn[], args: any) {
    return Promise.all(hooks.map((hook) => hook.apply(hooks, args)));
  }
}
