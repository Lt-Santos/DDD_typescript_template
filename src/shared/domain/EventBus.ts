import DomainEvent from "./DomainEvent";
import EventHandler from "./EventHandler.type";
import IEventBus from "./IEventBus";

/**
 * In-memory implementation of an Event Bus for Domain Events.
 *
 * The EventBus allows the registration of event handlers and dispatches domain events
 * to their corresponding handlers when published.
 */
class EventBus implements IEventBus {
  /**
   * Internal registry that maps event types to arrays of handlers.
   */
  private handlers = new Map<Function, EventHandler<any>[]>();

  /**
   * Registers an event handler for a specific domain event type.
   *
   * @template T - A type that extends DomainEvent
   * @param eventType - The class constructor of the domain event
   * @param handler - A function to handle the event when published
   */
  public register<T extends DomainEvent>(
    eventType: new (...args: any[]) => T,
    handler: EventHandler<T>
  ): void {
    const existing = this.handlers.get(eventType) || [];
    this.handlers.set(eventType, [
      ...existing,
      handler as EventHandler<DomainEvent>,
    ]);
  }

  /**
   * Publishes an array of domain events.
   * All registered handlers for each event type will be invoked asynchronously.
   *
   * @param events - An array of domain events to publish
   */
  public async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const eventType = event.constructor;
      const handlers = this.handlers.get(eventType) || [];
      for (const handler of handlers) {
        await handler(event);
      }
    }
  }

  /**
   * Clears all registered event handlers from the event bus.
   */
  public clear(): void {
    this.handlers.clear();
  }
}

export default EventBus;
