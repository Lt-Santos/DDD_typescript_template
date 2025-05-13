import User from "./User";

/**
 * Interface representing the contract for a user repository.
 * This abstraction allows the domain layer to remain decoupled from the persistence implementation.
 */
interface IUserRepository {
  /**
   * Persists a user to the underlying data store.
   *
   * @param user - The User entity to be saved
   * @returns A Promise that resolves when the user is successfully saved
   */
  save(user: User): Promise<void>;

  /**
   * Finds a user by their email address.
   *
   * @param email - The email address to search for
   * @returns A Promise that resolves to the User entity if found, or null otherwise
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Checks whether a user exists with the given email address.
   *
   * @param email - The email address to check for existence
   * @returns A Promise that resolves to true if a user exists, false otherwise
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Finds a user by their unique identifier.
   *
   * @param id - The unique identifier of the user
   * @returns A Promise that resolves to the User entity if found, or null otherwise
   */
  findById(id: string): Promise<User | null>;
}

export default IUserRepository;
