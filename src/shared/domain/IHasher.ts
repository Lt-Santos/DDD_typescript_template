/**
 * Interface for a hashing service used to securely hash and compare values.
 *
 * This is typically used for hashing sensitive data like passwords.
 */
interface IHasher {
  /**
   * Hashes the provided value.
   *
   * @param value - The raw string value to be hashed.
   * @returns A Promise that resolves to the hashed string.
   */
  hash(value: string): Promise<string>;

  /**
   * Compares a raw value to a hashed value to determine if they match.
   *
   * @param value - The raw value to compare.
   * @param hashed - The hashed value to compare against.
   * @returns A Promise that resolves to true if the values match, false otherwise.
   */
  compare(value: string, hashed: string): Promise<boolean>;
}

export default IHasher;
