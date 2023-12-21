export type IAsyncHookFn<T extends any[], R> = (...args: T) => Promise<R>;
export type ISyncHookFn<T extends any[], R> = (...args: T) => R;
export interface HookOpts {
  context?: any;
  insert?: number,
  [key: string]: any;
}
export type HookInfo<F extends Function> = HookOpts & { fn: F };

export type AsArray<T> = T extends any[] ? T : [T];
