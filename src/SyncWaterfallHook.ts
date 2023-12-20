import Hook from "./Hook";
import { ISyncHookFn } from "./types";

class SyncWaterfallHook<T extends any[], R = T[0]> extends Hook<
  ISyncHookFn<T, R>
> {
  call(...args: T): R {
    for (let hook of this.hooks) {
      args[0] = hook.fn!.apply(hook.context, args);
    }
    return args[0];
  }
}

export default SyncWaterfallHook;
