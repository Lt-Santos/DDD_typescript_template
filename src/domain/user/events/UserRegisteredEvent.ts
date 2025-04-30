import DomainEvent from "@/shared/domain/DomainEvent";
import User from "../User";

class UserRegisteredEvent implements DomainEvent {
  public readonly occurredAt = new Date();
  public readonly name = "UserRegisteredEvent";

  constructor(public readonly user: User) {}
}

export default UserRegisteredEvent;
