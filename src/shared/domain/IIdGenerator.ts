/**
 * Interface for a service that generates unique identifiers.
 *
 * Useful for creating IDs for entities, events, or other uniquely identifiable objects.
 */
interface IIdGenerator {
  /**
   * Generates a new unique identifier.
   *
   * @returns A unique string identifier.
   */
  generate(): string;
}

export default IIdGenerator;
