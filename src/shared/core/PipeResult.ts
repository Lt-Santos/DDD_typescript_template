import Result from "./Result";

export class PipeResult<T, E> {
  constructor(private readonly result: Promise<Result<T, E>>) {}

  onSuccess<U>(fn: (value: T) => U): PipeResult<U, E> {
    const newResult = this.result.then((res) => {
      if (res.isFail()) return Result.fail(res.getError());
      return Result.ok(fn(res.getValue()));
    });

    return new PipeResult(Promise.resolve(newResult));
  }

  andThen<U>(fn: (value: T) => Result<U, E>): PipeResult<U, E> {
    const newResult = this.result.then((res) => {
      if (res.isFail()) return Result.fail(res.getError());
      return Promise.resolve(fn(res.getValue()));
    });

    return new PipeResult(newResult);
  }

  onSuccessAsync<U>(fn: (value: T) => Promise<U>): PipeResult<U, E> {
    const newResult = this.result.then(async (res) => {
      if (res.isFail()) return Result.fail(res.getError());
      const mapped = await fn(res.getValue());
      return Result.ok(mapped);
    });
    return new PipeResult(newResult);
  }

  andThenAsync<U>(fn: (value: T) => Promise<Result<U, E>>): PipeResult<U, E> {
    const newResult = this.result.then(async (res) => {
      if (res.isFail()) return Result.fail(res.getError());
      return fn(res.getValue());
    });
    return new PipeResult(newResult);
  }

  mapOrElse<U>(
    onSuccess: (value: T) => U,
    onFailure: (error: E) => U
  ): Promise<U> {
    return this.result.then((res) => {
      if (res.isFail()) {
        return onFailure(res.getError());
      }
      return onSuccess(res.getValue());
    });
  }

  flatMapOrElse<U>(
    onSuccess: (value: T) => Promise<U>,
    onFailure: (error: E) => Promise<U>
  ): Promise<U> {
    return this.result.then(async (res) => {
      if (res.isFail()) {
        return onFailure(res.getError());
      }
      return onSuccess(res.getValue());
    });
  }

  async execute(): Promise<Result<T, E>> {
    return this.result;
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
