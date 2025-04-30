import { v4 as uuidv4 } from "uuid";
import { injectable } from "tsyringe";
import IIdGenerator from "@/shared/domain/IIdGenerator";

@injectable()
class UuidGenerator implements IIdGenerator {
  generate(): string {
    return uuidv4();
  }
}

export default UuidGenerator;
