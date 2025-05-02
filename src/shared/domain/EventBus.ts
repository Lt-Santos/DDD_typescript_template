import DomainEvent from "./DomainEvent";

type EventHandler<T extends DomainEvent = DomainEvent> = (
  event: T
) => void | Promise<void>;

class EventBus {
  private handlers = new Map<Function, EventHandler<any>[]>();

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

  public async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const eventType = event.constructor;
      const handlers = this.handlers.get(eventType) || [];
      for (const handler of handlers) {
        await handler(event);
      }
    }
  }

  public clear(): void {
    this.handlers.clear();
  }
}

export default EventBus;
