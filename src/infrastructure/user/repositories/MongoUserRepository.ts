import IUserRepository from "@/domain/user/IUserRepository";
import UserModel from "../models/user.model";
import User from "@/domain/user/User";
import UserMapper from "@/infrastructure/user/mappers/UserMapper";

class MongoUserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    const newUser = UserMapper.toPersistence(user);
    await UserModel.findByIdAndUpdate(newUser.id, newUser, { upsert: true });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email });
    return count > 0;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    return this.returnsUserOrNull(doc);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return this.returnsUserOrNull(doc);
  }

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
