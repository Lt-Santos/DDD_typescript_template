interface DomainEvent {
  readonly occurredAt: Date;
  readonly name: string;
}

export default DomainEvent;
