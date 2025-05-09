import DomainEvent from "./DomainEvent";

type EventHandler<T extends DomainEvent = DomainEvent> = (
  event: T
) => void | Promise<void>;

export default EventHandler;
