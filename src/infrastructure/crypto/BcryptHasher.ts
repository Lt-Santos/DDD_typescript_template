import bcrypt from "bcryptjs";
import IHasher from "@/shared/domain/IHasher";

class BcryptHasher implements IHasher {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }
  async compare(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}

export default BcryptHasher;
