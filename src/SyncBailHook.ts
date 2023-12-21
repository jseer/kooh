import Hook from "./Hook";
import { ISyncHookFn, AsArray } from "./types";

class SyncBailHook<T, R> extends Hook<ISyncHookFn<AsArray<T>, R | void>> {
  call(...args: AsArray<T>): R | void {
    let result;
    for (let hook of this.hooks) {
      result = hook.fn!.apply(hook.context, args);
      if (result) return result;
    }
  }
}

export default SyncBailHook;
