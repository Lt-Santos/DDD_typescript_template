import DomainEvent from "./DomainEvent";

/**
 * Abstract base class representing an Aggregate Root in Domain-Driven Design (DDD).
 *
 * An aggregate root is the entry point to a cluster of domain objects that should be treated as a single unit.
 * This class provides basic support for tracking and pulling domain events.
 */
abstract class AggregateRoot {
  /**
   * Internal unique identifier for the aggregate root.
   * Typically assigned by the extending entity.
   */
  protected readonly _id: string;

  /**
   * Queue of domain events that occurred within this aggregate.
   */
  private domainEvents: DomainEvent[] = [];

  /**
   * Adds a domain event to the internal queue.
   * Intended to be called when something significant occurs in the aggregate's business logic.
   *
   * @param event - The domain event to record
   */
  protected addDomainEvent(event: DomainEvent) {
    this.domainEvents.push(event);
  }

  /**
   * Returns all accumulated domain events and clears the internal event queue.
   * Typically called after persisting the aggregate, so that events can be dispatched to handlers.
   *
   * @returns An array of domain events
   */
  public pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }
}

export default AggregateRoot;
