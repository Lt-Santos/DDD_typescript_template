import DomainEvent from "./DomainEvent";
import EventHandler from "./EventHandler.type";

/**
 * Interface for an event bus used to register and publish domain events.
 *
 * Implementations of this interface are responsible for managing domain event
 * handlers and ensuring that events are dispatched to the appropriate handlers.
 */
interface IEventBus {
  /**
   * Registers an event handler for a specific type of domain event.
   *
   * @template T - The specific type of DomainEvent to handle.
   * @param eventType - The constructor function of the domain event class.
   * @param handler - The event handler function to execute when the event is published.
   */
  register<T extends DomainEvent>(
    eventType: new (...args: any[]) => T,
    handler: EventHandler<T>
  ): void;

  /**
   * Publishes a list of domain events, triggering all corresponding registered handlers.
   *
   * @param events - An array of domain events to publish.
   * @returns A Promise that resolves once all handlers have completed.
   */
  publish(events: DomainEvent[]): Promise<void>;

  /**
   * Clears all registered event handlers from the event bus.
   */
  clear(): void;
}

export default IEventBus;
