import Hook from "./Hook";
import { IAsyncHookFn } from "./types";

class AsyncSeriesWaterfallHook<T extends any[], R = T[0]> extends Hook<
  IAsyncHookFn<T, R>
> {
  async call(...args: T): Promise<R> {
    for (let hook of this.hooks) {
      args[0] = await hook.fn!.apply(hook.context, args);
    }
    return args[0];
  }
}

export default AsyncSeriesWaterfallHook;
