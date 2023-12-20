import Hook from "./Hook";
import { IAsyncHookFn } from "./types";

class AsyncParallelHook<T extends any[], R = void> extends Hook<
  IAsyncHookFn<T, R>
> {
  call(...args: T): Promise<R[]> {
    return Promise.all(
      this.hooks.map((hook) => hook.fn!.apply(hook.context, args))
    );
  }
}

export default AsyncParallelHook;
