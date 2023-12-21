import Hook from "./Hook";
import { AsArray, IAsyncHookFn } from "./types";

class AsyncParallelHook<T, R = void> extends Hook<IAsyncHookFn<AsArray<T>, R>> {
  call(...args: AsArray<T>): Promise<R[]> {
    return Promise.all(
      this.hooks.map((hook) => hook.fn!.apply(hook.context, args))
    );
  }
}

export default AsyncParallelHook;
