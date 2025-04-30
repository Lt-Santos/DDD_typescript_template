import User from "./User";

interface IUserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  findById(id: string): Promise<User | null>;
}

export default IUserRepository;
