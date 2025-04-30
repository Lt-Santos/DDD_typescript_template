import DomainEvent from "./DomainEvent";

abstract class AggregateRoot {
  private readonly _id: string;
  private domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent) {
    this.domainEvents.push(event);
  }
  public pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }
}

export default AggregateRoot;
