import { v4 as uuidv4 } from "uuid";
import { injectable } from "tsyringe";
import IIdGenerator from "@/shared/domain/IIdGenerator";

/**
 * UUID-based implementation of the ID generator interface.
 * Generates RFC4122 v4 UUIDs.
 */
@injectable()
class UuidGenerator implements IIdGenerator {
  /**
   * Generates a new UUID v4 string.
   * @returns A unique string identifier.
   */
  generate(): string {
    return uuidv4();
  }
}

export default UuidGenerator;
