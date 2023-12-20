import Hook from "./Hook";
import { ISyncHookFn } from "./types";

class SyncConcatHook<T extends any[], R = any> extends Hook<ISyncHookFn<T, R>> {
  call(...args: T): R[] {
    let result: R[] = [];
    for (let hook of this.hooks) {
      result = result.concat(hook.fn!.apply(hook.context, args));
    }
    return result;
  }
}

export default SyncConcatHook;
