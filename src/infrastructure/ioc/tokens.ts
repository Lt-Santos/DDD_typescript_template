import Token from "./token";

const TOKENS = {
  IUserRepository: new Token("IUserRepository"),
  EmailService: new Token("EmailService"),
  IHasher: new Token("IHasher"),
  IIdGenerator: new Token("IIdGenerator"),
};

export default TOKENS;
