import Hook from "./Hook";
import { ISyncHookFn } from "./types";

class SyncHook<T extends any[], R = void> extends Hook<ISyncHookFn<T, R>> {
  call(...args: T): void {
    for (let hook of this.hooks) {
      hook.fn!.apply(hook.context, args);
    }
  }
}

export default SyncHook;
