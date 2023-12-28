import { HookInfo, HookOpts } from "./types";

class Hook<F extends Function = Function> {
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
    const mergeOptions = (opts: HookOpts) => Object.assign({}, options, opts);
    return {
      add: (fn: F, opts: HookOpts) => this.add(fn, mergeOptions(opts)),
      remove: this.remove.bind(this),
      withOptions: (opts: HookOpts) => this.withOptions(mergeOptions(opts)),
    };
  }
}

export default Hook;
