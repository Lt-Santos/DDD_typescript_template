import { container } from "tsyringe";
import IHasher from "@/shared/domain/IHasher";
import BcryptHasher from "./crypto/BcryptHasher";

container.register<IHasher>("IHasher", { useClass: BcryptHasher });
