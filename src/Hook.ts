import { IHookInfo } from "./types";

interface IAddOptions {
  before?: string;
  stage?: number;
  [key: string]: any;
}

class Hook<F extends Function> {
  protected hooks: IHookInfo<F>[];
  constructor() {
    this.hooks = [];
  }
  add(fn: F | IHookInfo<F>, hookInfo: IHookInfo<F> = {}) {
    if (typeof fn === "function") {
      hookInfo.fn = fn;
    } else {
      hookInfo = fn || {};
      if (typeof hookInfo.fn !== "function") {
        throw new Error("must be add a hook fn");
      }
    }
    return this.hooks.push(hookInfo);
  }

  remove(fn: Function) {
    const index = this.hooks.findIndex((info) => info.fn === fn);
    if (index === -1) return false;
    return this.hooks.splice(index, 1);
  }

  withOptions(options: IAddOptions) {
    const oldAdd = this.add;
    this.add = function (fn: F | IHookInfo<F>, hookInfo: IHookInfo<F> = {}) {
      if (typeof fn !== "function") {
        hookInfo = fn;
      }
      return oldAdd.call(this, fn, Object.assign({}, options, hookInfo));
    };
    return this;
  }
}

export default Hook;
