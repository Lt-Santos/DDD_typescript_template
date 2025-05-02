import Token from "./Token";

const TOKENS = {
  IUserRepository: new Token("IUserRepository"),
  EmailService: new Token("EmailService"),
  IHasher: new Token("IHasher"),
  IIdGenerator: new Token("IIdGenerator"),
};

export default TOKENS;
