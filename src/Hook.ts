import { HookInfo, HookOpts } from "./types";

class Hook<F extends Function> {
  hooks: HookInfo<F>[];
  constructor() {
    this.hooks = [];
  }
  add(fn: F, opts: HookOpts = {}) {
    if (typeof fn !== "function") {
      throw new Error("fn must be an function");
    }
    return this.hooks.push(Object.assign({ fn }, opts));
  }

  remove(fn: F) {
    const index = this.hooks.findIndex((info) => info.fn === fn);
    if (index === -1) return false;
    return this.hooks.splice(index, 1);
  }

  withOptions(options: HookOpts) {
    const oldAdd = this.add;
    this.add = function (fn: F, opts: HookOpts = {}) {
      return oldAdd.call(this, fn, Object.assign({}, options, opts));
    };
    return this;
  }
}

export default Hook;
