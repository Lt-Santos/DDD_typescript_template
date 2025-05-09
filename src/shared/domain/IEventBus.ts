import DomainEvent from "./DomainEvent";
import EventHandler from "./EventHandler.type";

interface IEventBus {
  register<T extends DomainEvent>(
    eventType: new (...args: any[]) => T,
    handler: EventHandler<T>
  ): void;
  publish(events: DomainEvent[]): Promise<void>;
  clear(): void;
}

export default IEventBus;
