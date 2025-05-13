/**
 * Represents the "Left" side of an Either type.
 * Typically used to hold an error or failure value.
 *
 * @template L - Type of the value contained in Left.
 */
export class Left<L> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  /**
   * Type guard to identify this as a Left variant.
   * @returns True if this is Left.
   */
  isLeft(): this is Left<L> {
    return true;
  }

  /**
   * Type guard to identify this as a Right variant.
   * @returns False, since this is Left.
   */
  isRight(): this is Right<any> {
    return false;
  }
}

/**
 * Represents the "Right" side of an Either type.
 * Typically used to hold a success or result value.
 *
 * @template R - Type of the value contained in Right.
 */
export class Right<R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  /**
   * Type guard to identify this as a Left variant.
   * @returns False, since this is Right.
   */
  isLeft(): this is Left<any> {
    return false;
  }

  /**
   * Type guard to identify this as a Right variant.
   * @returns True if this is Right.
   */
  isRight(): this is Right<R> {
    return true;
  }
}

/**
 * Represents a value of one of two possible types (a disjoint union).
 * An Either is either a Left (commonly used for failure) or a Right (commonly used for success).
 *
 * @template L - Type of Left.
 * @template R - Type of Right.
 */
export type Either<L, R> = Left<L> | Right<R>;

/**
 * Helper function to create a Left instance.
 *
 * @param l - The left value.
 * @returns An Either instance representing failure.
 */
export const left = <L>(l: L): Either<L, never> => new Left(l);

/**
 * Helper function to create a Right instance.
 *
 * @param r - The right value.
 * @returns An Either instance representing success.
 */
export const right = <R>(r: R): Either<never, R> => new Right(r);
