import Hook from "./Hook";
import { AsArray, IAsyncHookFn } from "./types";

class AsyncSeriesHook<T> extends Hook<IAsyncHookFn<AsArray<T>, void>> {
  async call(...args: AsArray<T>): Promise<void> {
    for (let hook of this.hooks) {
      await hook.fn!.apply(hook.context, args);
    }
  }
}

export default AsyncSeriesHook;
