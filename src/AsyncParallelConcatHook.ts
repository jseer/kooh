import AsyncParallelHook from "./AsyncParallelHook";

class AsyncParallelConcatHook<T extends any[]> extends AsyncParallelHook<
  T,
  any[]
> {
  call(...args: T) {
    return super
      .call(...args)
      .then((result) => result.reduce((memo, r) => memo.concat(r), []));
  }
}

export default AsyncParallelConcatHook;
