import Hook from "./Hook";
import { AsArray, IAsyncHookFn } from "./types";

class AsyncSeriesWaterfallHook<T, R = AsArray<T>[0]> extends Hook<
  IAsyncHookFn<AsArray<T>, R>
> {
  async call(...args: AsArray<T>): Promise<R> {
    for (let hook of this.hooks) {
      args[0] = await hook.fn!.apply(hook.context, args);
    }
    return args[0];
  }
}

export default AsyncSeriesWaterfallHook;
