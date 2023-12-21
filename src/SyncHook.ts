import Hook from "./Hook";
import { AsArray, ISyncHookFn } from "./types";

class SyncHook<T> extends Hook<ISyncHookFn<AsArray<T>, void>> {
  call(...args: AsArray<T>): void {
    for (let hook of this.hooks) {
      hook.fn!.apply(hook.context, args);
    }
  }
}

export default SyncHook;
