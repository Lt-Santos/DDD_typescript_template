import IHasher from "@/shared/domain/IHasher";
import Email from "./valueObjects/Email";
import Password from "./valueObjects/Password";

export type CreateUserType = {
  id: string;
  emailStr: string;
  rawPassword: string;
  hasher: IHasher;
  verified: boolean;
};

export type RegisterUserType = {
  id: string;
  emailStr: string;
  rawPassword: string;
  hasher: IHasher;
};

export type UserPropType = {
  email: Email;
  password: Password;
  verified: boolean;
};
