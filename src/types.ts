export type IAsyncHookFn<T extends any[], R> = (...args: T) => Promise<R>;
export type ISyncHookFn<T extends any[], R> = (...args: T) => R;
export interface IHookInfo<F> {
  context?: any;
  fn?: F;
  [key: string]: any;
}
