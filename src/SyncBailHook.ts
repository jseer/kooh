import Hook from "./Hook";
import { ISyncHookFn } from "./types";

class SyncBailHook<T extends any[], R = any> extends Hook<ISyncHookFn<T, R>> {
  call(...args: T): R | void {
    let result;
    for (let hook of this.hooks) {
      result = hook.fn!.apply(hook.context, args);
      if (result) return result;
    }
  }
}

export default SyncBailHook;
