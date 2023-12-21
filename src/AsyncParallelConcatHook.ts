import AsyncParallelHook from "./AsyncParallelHook";
import { AsArray } from "./types";

class AsyncParallelConcatHook<T, R> extends AsyncParallelHook<T, R | R[]> {
  call(...args: AsArray<T>) {
    return super
      .call(...args)
      .then((result) => result.reduce<R[]>((memo, r) => memo.concat(r), []));
  }
}

export default AsyncParallelConcatHook;
