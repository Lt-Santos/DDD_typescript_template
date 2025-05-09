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

    return new PipeResult(Promise.resolve(next));
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

  andThenAsync<U>(
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

export const combinePipeResults = <T extends any[], E>(results: {
  [K in keyof T]: Promise<Result<T[K], E>>;
}): PipeResult<T, E> => {
  const combined = Promise.all(results).then((resultList) => {
    for (const result of resultList) {
      if (result.isFail()) {
        return Result.fail<T, E>(result.getError());
      }
    }
    const values = resultList.map((r) => r.getValue()) as T;
    return Result.ok(values);
  });
  return new PipeResult(combined);
};
