import { IHookInfo } from "./types";

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
}

export default Hook;
