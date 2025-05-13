/**
 * Base class for implementing Value Objects in Domain-Driven Design (DDD).
 *
 * Value Objects are immutable and are compared based on their properties rather than identity.
 * This class provides a standard structure and equality logic for all value objects.
 *
 * @typeParam T - The type of the properties contained within the value object.
 */
abstract class ValueObject<T> {
  /**
   * The internal, immutable properties of the value object.
   */
  protected readonly props: T;

  /**
   * Constructs a new ValueObject with the given properties.
   *
   * @param props - The properties that define the value object.
   */
  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  /**
   * Compares this value object with another for equality.
   *
   * @param vo - Another value object to compare against.
   * @returns True if both value objects have the same type and properties; otherwise, false.
   */
  public equals(vo: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) return false;
    if (vo.constructor.name !== this.constructor.name) return false;

    return JSON.stringify(vo.props) === JSON.stringify(this.props);
  }
}

export default ValueObject;
