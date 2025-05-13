import bcrypt from "bcryptjs";
import IHasher from "@/shared/domain/IHasher";

/**
 * Implementation of the `IHasher` interface using bcrypt for hashing and comparing values.
 */
class BcryptHasher implements IHasher {
  /**
   * Hashes a plaintext value using bcrypt.
   *
   * @param value - The plaintext string to hash
   * @returns A Promise that resolves to the hashed string
   */
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  /**
   * Compares a plaintext value with a hashed value to check for a match.
   *
   * @param value - The plaintext string to compare
   * @param hashed - The hashed string to compare against
   * @returns A Promise that resolves to `true` if the values match, or `false` otherwise
   */
  async compare(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}

export default BcryptHasher;
