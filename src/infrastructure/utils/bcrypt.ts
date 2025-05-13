import bcrypt from "bcryptjs";

/**
 * Hashes a plaintext value using bcrypt.
 * @param value - The plaintext value to hash.
 * @param saltRounds - Optional number of salt rounds to use (default is 10).
 * @returns A promise resolving to the hashed value.
 */
export const hashValue = async (value: string, saltRounds?: number) =>
  bcrypt.hash(value, saltRounds || 10);

/**
 * Compares a plaintext value against a hashed value using bcrypt.
 * @param value - The plaintext value to compare.
 * @param hashedValue - The hashed value to compare against.
 * @returns A promise resolving to true if the values match, false otherwise.
 */
export const compareValue = async (value: string, hashedValue: string) =>
  bcrypt.compare(value, hashedValue).catch(() => false);
