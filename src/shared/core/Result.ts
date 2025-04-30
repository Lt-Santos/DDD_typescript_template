import { Either, left, right } from "./Either";

class Result<T, E> {
  private constructor(
    private readonly isSuccess: boolean,
    private readonly value?: T,
    private readonly error?: E
  ) {
    if (isSuccess && error)
      throw new Error("Successful result cannot contain an error");
    if (!isSuccess && !error)
      throw new Error("Failed result must contain an error");
  }

  public static ok<T, E = never>(value?: T): Result<T, E> {
    return new Result<T, E>(true, value);
  }

  public static fail<T = never, E = unknown>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  public isOk(): boolean {
    return this.isSuccess;
  }

  public isFail(): boolean {
    return !this.isSuccess;
  }

  public getValue(): T {
    if (!this.isSuccess)
      throw new Error("Cannot get value from a failed result");
    return this.value as T;
  }

  public getError(): E {
    if (this.isSuccess)
      throw new Error("Cannot get error from a successful result");
    return this.error as E;
  }

  public map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isOk()) {
      return Result.ok(fn(this.getValue()));
    }
    return Result.fail(this.getError());
  }

  public flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this.isOk()) {
      return fn(this.getValue());
    }
    return Result.fail(this.getError());
  }

  public async asyncMap<U>(
    fn: (value: T) => Promise<U>
  ): Promise<Result<U, E>> {
    if (this.isOk()) {
      const mapped = await fn(this.getValue());
      return Result.ok(mapped);
    }
    return Result.fail(this.getError());
  }

  public async asyncFlatMap<U>(
    fn: (value: T) => Promise<Result<U, E>>
  ): Promise<Result<U, E>> {
    if (this.isOk()) {
      return await fn(this.getValue());
    }
    return Result.fail(this.getError());
  }

  public toEither(): Either<E, T> {
    return this.isSuccess ? right(this.value as T) : left(this.error as E);
  }
}

export default Result;
