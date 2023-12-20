import Hook from "./Hook";
import { IAsyncHookFn } from "./types";

class AsyncSeriesHook<T extends any[], R = void> extends Hook<
  IAsyncHookFn<T, R>
> {
  async call(...args: T): Promise<void> {
    for (let hook of this.hooks) {
      await hook.fn!.apply(hook.context, args);
    }
  }
}

export default AsyncSeriesHook;
