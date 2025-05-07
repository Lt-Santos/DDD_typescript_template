import IHasher from "@/shared/domain/IHasher";

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
