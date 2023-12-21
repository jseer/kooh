import Hook from "./Hook";
import { IAsyncHookFn, AsArray } from "./types";

class AsyncSeriesBailHook<T, R> extends Hook<
  IAsyncHookFn<AsArray<T>, R | void>
> {
  async call(...args: AsArray<T>): Promise<R | void> {
    let result;
    for (let hook of this.hooks) {
      result = await hook.fn!.apply(hook.context, args);
      if (result) return result;
    }
  }
}

export default AsyncSeriesBailHook;
