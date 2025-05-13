import IUserRepository from "@/domain/user/IUserRepository";
import UserModel from "../models/user.model";
import User from "@/domain/user/User";
import UserMapper from "@/infrastructure/user/mappers/UserMapper";

/**
 * MongoDB implementation of the User repository interface.
 */
class MongoUserRepository implements IUserRepository {
  /**
   * Saves or updates a user in the MongoDB database.
   * @param user - The User domain entity to save.
   */
  async save(user: User): Promise<void> {
    const newUser = UserMapper.toPersistence(user);
    await UserModel.findByIdAndUpdate(newUser.id, newUser, { upsert: true });
  }

  /**
   * Checks whether a user exists with the given email.
   * @param email - The email to search for.
   * @returns True if a user exists, false otherwise.
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email });
    return count > 0;
  }

  /**
   * Finds a user by email.
   * @param email - The email of the user to find.
   * @returns A domain User or null if not found.
   */
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    return this.returnsUserOrNull(doc);
  }

  /**
   * Finds a user by ID.
   * @param id - The user ID.
   * @returns A domain User or null if not found.
   */
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return this.returnsUserOrNull(doc);
  }

  /**
   * Attempts to convert a document to a domain User or return null.
   * @param doc - The MongoDB document.
   * @returns A User instance or null.
   */
  private async returnsUserOrNull(doc: any): Promise<User | null> {
    if (!doc) return null;
    const mappedUser = await UserMapper.toDomain(doc);
    if (mappedUser.isFail()) {
      return null;
    }
    return mappedUser.getValue();
  }
}

export default MongoUserRepository;
