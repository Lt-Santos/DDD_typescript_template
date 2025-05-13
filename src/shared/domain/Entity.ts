import AggregateRoot from "./AggregateRoot";

/**
 * Abstract base class representing a Domain Entity.
 *
 * In DDD, an Entity is an object that is distinguished by its identity (ID), rather than by its attributes.
 * This class extends the `AggregateRoot`, enabling it to also manage domain events.
 *
 * @template T - Optional type representing the shape of the entity's properties
 */
abstract class Entity<T> extends AggregateRoot {
  /**
   * Creates a new Entity instance with a unique identifier.
   *
   * @param id - The unique identifier of the entity
   */
  constructor(id: string) {
    super();
    (this as any)._id = id; // Assigning _id declared in AggregateRoot
  }

  /**
   * Checks if this entity is equal to another entity.
   * Equality is based on ID comparison.
   *
   * @param object - The other entity to compare with
   * @returns `true` if both entities have the same ID, `false` otherwise
   */
  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) return false;
    if (this === object) return true;
    return this.id === object.id;
  }

  /**
   * Gets the unique identifier of the entity.
   *
   * @returns The entity's ID
   */
  public get id(): string {
    return (this as any)._id;
  }
}

export default Entity;
