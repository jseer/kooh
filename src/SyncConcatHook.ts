import Hook from "./Hook";
import { AsArray, ISyncHookFn } from "./types";

class SyncConcatHook<T, R> extends Hook<ISyncHookFn<AsArray<T>, R | R[]>> {
  call(...args: AsArray<T>): R[] {
    let result: R[] = [];
    for (let hook of this.hooks) {
      result = result.concat(hook.fn!.apply(hook.context, args) as R[]);
    }
    return result;
  }
}

export default SyncConcatHook;
