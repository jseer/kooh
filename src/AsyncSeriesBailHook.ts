import Hook from "./Hook";
import { IAsyncHookFn } from "./types";

class AsyncSeriesBailHook<T extends any[], R = any> extends Hook<
  IAsyncHookFn<T, R>
> {
  async call(...args: T): Promise<R | void> {
    let result;
    for (let hook of this.hooks) {
      result = await hook.fn!.apply(hook.context, args);
      if (result) return result;
    }
  }
}

export default AsyncSeriesBailHook;
