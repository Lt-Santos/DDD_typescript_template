import DomainEvent from "./DomainEvent";

type EventHandler<T extends DomainEvent = DomainEvent> = (
  event: T
) => void | Promise<void>;

class EventBus {
  private handlers: Map<string, EventHandler<DomainEvent>[]> = new Map();

  public register<T extends DomainEvent>(
    eventName: string,
    handler: EventHandler<T>
  ): void {
    const existing = this.handlers.get(eventName) || [];
    this.handlers.set(eventName, [
      ...existing,
      handler as EventHandler<DomainEvent>,
    ]);
  }

  public async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const handlers = this.handlers.get(event.name) || [];
      for (const handler of handlers) {
        await handler(event);
      }
    }
  }
}

export default EventBus;
