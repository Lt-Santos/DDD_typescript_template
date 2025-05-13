import { Either, left, right } from "./Either";

/**
 * A generic container for representing the outcome of an operation
 * that can either succeed (`ok`) or fail (`fail`) without using exceptions.
 *
 * Inspired by the Result pattern from functional programming.
 *
 * @template T - The success value type.
 * @template E - The error value type.
 */
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

  /**
   * Creates a successful result containing the given value.
   *
   * @param value - The success value to wrap (optional).
   * @returns A Result representing success.
   */
  public static ok<T, E = never>(value?: T): Result<T, E> {
    return new Result<T, E>(true, value);
  }

  /**
   * Creates a failed result containing the given error.
   *
   * @param error - The error to wrap.
   * @returns A Result representing failure.
   */
  public static fail<T = never, E = unknown>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  /**
   * Returns true if the result is a success.
   */
  public isOk(): boolean {
    return this.isSuccess;
  }

  /**
   * Returns true if the result is a failure.
   */
  public isFail(): boolean {
    return !this.isSuccess;
  }

  /**
   * Gets the value inside a successful result.
   *
   * @throws If the result is a failure.
   * @returns The success value.
   */
  public getValue(): T {
    if (!this.isSuccess)
      throw new Error("Cannot get value from a failed result");
    return this.value as T;
  }

  /**
   * Gets the error inside a failed result.
   *
   * @throws If the result is a success.
   * @returns The error value.
   */
  public getError(): E {
    if (this.isSuccess)
      throw new Error("Cannot get error from a successful result");
    return this.error as E;
  }

  /**
   * Converts the result into an Either monad.
   * - `Right<T>` if success
   * - `Left<E>` if failure
   *
   * @returns An Either representation of the Result.
   */
  public toEither(): Either<E, T> {
    return this.isSuccess ? right(this.value as T) : left(this.error as E);
  }
}

export default Result;
