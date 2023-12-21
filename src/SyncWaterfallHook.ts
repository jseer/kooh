import Hook from "./Hook";
import { AsArray, ISyncHookFn } from "./types";

class SyncWaterfallHook<T, R = AsArray<T>[0]> extends Hook<
  ISyncHookFn<AsArray<T>, R>
> {
  call(...args: AsArray<T>): R {
    for (let hook of this.hooks) {
      args[0] = hook.fn!.apply(hook.context, args);
    }
    return args[0];
  }
}

export default SyncWaterfallHook;
