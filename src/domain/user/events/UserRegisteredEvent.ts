import DomainEvent from "@/shared/domain/DomainEvent";
import User from "../User";

/**
 * Domain event triggered when a new user is registered.
 *
 * This event can be used to notify other parts of the system (e.g., sending welcome emails,
 * logging, or triggering workflows) when a user registration is successfully completed.
 */
class UserRegisteredEvent implements DomainEvent {
  /**
   * The timestamp when the event occurred.
   */
  public readonly occurredAt = new Date();

  /**
   * The name of the event, derived dynamically from the class name.
   */
  public readonly name: string;

  /**
   * Creates a new instance of the UserRegisteredEvent.
   *
   * @param user - The user who has been registered
   */
  constructor(public readonly user: User) {
    this.name = this.constructor.name;
    this.occurredAt = new Date();
  }
}

export default UserRegisteredEvent;
