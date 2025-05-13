import DomainEvent from "./DomainEvent";

/**
 * Represents a function that handles a domain event.
 *
 * This type defines a generic event handler that takes a domain event of type `T`
 * (which extends `DomainEvent`) and performs side effects or business logic.
 * The handler can be synchronous or asynchronous.
 *
 * @template T - A specific type of DomainEvent to handle. Defaults to DomainEvent.
 * @param event - The event instance to handle.
 * @returns Either void or a Promise resolving to void.
 */
type EventHandler<T extends DomainEvent = DomainEvent> = (
  event: T
) => void | Promise<void>;

export default EventHandler;
