abstract class ValueObject<T> {
  protected readonly props: T;
  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(vo: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) return false;
    if (vo.constructor.name !== this.constructor.name) return false;

    return JSON.stringify(vo.props) === JSON.stringify(this.props);
  }
}

export default ValueObject;
