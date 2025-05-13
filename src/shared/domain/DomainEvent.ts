/**
 * Represents a Domain Event in Domain-Driven Design (DDD).
 *
 * Domain events describe something that happened in the domain that is important to business processes.
 * These events are immutable and typically used to trigger side effects or notify other parts of the system.
 */
interface DomainEvent {
  /**
   * The exact time when the domain event occurred.
   */
  readonly occurredAt: Date;

  /**
   * A descriptive name of the event.
   * Typically used for logging, event dispatching, or debugging.
   */
  readonly name: string;
}

export default DomainEvent;
