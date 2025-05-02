import "reflect-metadata";
import { container } from "tsyringe";
import TOKENS from "@/infrastructure/ioc/tokens";
import IHasher from "../domain/IHasher";
import BcryptHasher from "@/infrastructure/crypto/BcryptHasher";

container.registerSingleton<IHasher>(TOKENS.IHasher.key, BcryptHasher);
