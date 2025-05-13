import Result from "./Result";

export class PipeResult<T, E> {
  constructor(private readonly promise: Promise<Result<T, E>>) {}

  onSuccess<U>(fn: (value: T) => U | Result<U, E>): PipeResult<U, E> {
    const next = this.promise.then((res) => {
      if (res.isFail()) return Result.fail(res.getError());

      try {
        const result = fn(res.getValue());
        return result instanceof Result ? result : Result.ok(result);
      } catch (error) {
        return Result.fail(error as E);
      }
    });

    return new PipeResult(next);
  }

  andThen<U>(fn: (value: T) => PipeResult<U, E>): PipeResult<U, E> {
    const next = this.promise.then(async (res) => {
      if (res.isFail()) return Result.fail(res.getError());
      return await fn(res.getValue()).execute();
    });

    return new PipeResult(next);
  }

  onSuccessAsync<U>(
    fn: (value: T) => Promise<U | Result<U, E>>
  ): PipeResult<U, E> {
    const newResult = this.promise.then(async (res) => {
      if (res.isFail()) return Result.fail(res.getError());

      try {
        const result = await fn(res.getValue());
        return result instanceof Result ? result : Result.ok(result);
      } catch (error) {
        return Result.fail(error as E);
      }
    });
    return new PipeResult(newResult);
  }

  onSuccessAsyncOrElse<U>(
    fn: (value: T) => Promise<PipeResult<U, E>>
  ): PipeResult<U, E> {
    const next = this.promise.then(async (res) => {
      if (res.isFail()) return Result.fail(res.getError());
      return (await fn(res.getValue())).execute();
    });
    return new PipeResult(next);
  }

  async onSuccessOrElse<U>(
    onSuccess: (value: T) => U,
    onFailure: (error: E) => U
  ): Promise<U> {
    return this.promise.then((res) => {
      if (res.isFail()) {
        return onFailure(res.getError());
      }
      return onSuccess(res.getValue());
    });
  }

  async andThenOrElse<U>(
    onSuccess: (value: T) => Promise<U>,
    onFailure: (error: E) => Promise<U>
  ): Promise<U> {
    return this.promise.then(async (res) => {
      if (res.isFail()) {
        return onFailure(res.getError());
      }
      return onSuccess(res.getValue());
    });
  }

  async execute(): Promise<Result<T, E>> {
    return this.promise;
  }

  async unwrapOrThrow(): Promise<T> {
    const res = await this.execute();
    //TODO: Add logging hook to improve tracking of unexpected failures
    if (res.isFail()) throw res.getError();
    return res.getValue();
  }

  async unwrapOrElse(defaultValue: T): Promise<T> {
    const res = await this.execute();
    return res.isFail() ? defaultValue : res.getValue();
  }
}

export const pipeResult = <T, E>(
  result: Result<T, E> | Promise<Result<T, E>>
): PipeResult<T, E> => {
  const promise = result instanceof Promise ? result : Promise.resolve(result);
  return new PipeResult(promise);
};

/**
 * Combines multiple asynchronous Result-returning tasks **sequentially** (one after the other).
 *
 * ✅ Use when:
 * - Tasks must be executed in order
 * - You want to **fail fast** (exit on the first error)
 * - Tasks have **side effects** (e.g., DB writes, API calls)
 *
 * ❌ Avoid when:
 * - Tasks are independent and can safely run in parallel
 * - Performance is a concern for I/O-heavy operations
 *
 * @template T Tuple of result types
 * @template E Error type
 * @param tasks An array of promises resolving to `Result<T, E>`
 * @returns A PipeResult containing either:
 * - Ok: a tuple of all successful values
 * - Fail: the first error encountered
 */
export const combinePipeResultsSequential = <T extends any[], E>(tasks: {
  [K in keyof T]: Promise<Result<T[K], E>>;
}): PipeResult<T, E> => {
  const combined = (async () => {
    const values: any[] = [];
    for (const task of tasks) {
      const result = await task;
      if (result.isFail()) return Result.fail<T, E>(result.getError());
      values.push(result.getValue());
    }
    return Result.ok(values as T);
  })();

  return new PipeResult(combined);
};

/**
 * Combines multiple asynchronous Result-returning tasks **in parallel**.
 *
 * ✅ Use when:
 * - Tasks are **pure functions** or **side-effect free**
 * - Task results are **independent**
 * - You want **faster execution**
 *
 * ❌ Avoid when:
 * - Order of execution matters
 * - Side effects (like DB writes) must not happen unless previous steps succeed
 *
 * @template T Tuple of result types
 * @template E Error type
 * @param tasks An array of promises resolving to `Result<T[K], E>`
 * @returns A PipeResult containing either:
 * - Ok: a tuple of all successful values
 * - Fail: the first error encountered (after all complete)
 */
export const combinePipeResultsParallel = <T extends any[], E>(tasks: {
  [K in keyof T]: Promise<Result<T[K], E>>;
}): PipeResult<T, E> => {
  const combined = Promise.all(tasks).then((results) => {
    for (const result of results) {
      if (result.isFail()) return Result.fail<T, E>(result.getError());
    }
    const values = results.map((r) => r.getValue()) as T;
    return Result.ok(values);
  });

  return new PipeResult(combined);
};
