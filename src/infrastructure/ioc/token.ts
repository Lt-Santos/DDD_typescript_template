class Token {
  private readonly _key: symbol;

  constructor(description: string) {
    this._key = Symbol(description);
  }

  get key(): symbol {
    return this._key;
  }
}

export default Token;
