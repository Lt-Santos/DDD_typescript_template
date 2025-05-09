import IUserRepository from "@/domain/user/IUserRepository";
import RegisterUserUseCase from "./RegisterUser.uc";
import IHasher from "@/shared/domain/IHasher";
import IEventBus from "@/shared/domain/IEventBus";
import IIdGenerator from "@/shared/domain/IIdGenerator";
import {
  EmailAlreadyTakenError,
  ValidationError,
} from "@/shared/core/errors/AppError";

const userRepoMock: jest.Mocked<IUserRepository> = {
  existsByEmail: jest.fn(),
  save: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
};

const hasherMock: jest.Mocked<IHasher> = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const eventBusMock: jest.Mocked<IEventBus> = {
  register: jest.fn(),
  publish: jest.fn(),
  clear: jest.fn(),
};

const idGenMock: jest.Mocked<IIdGenerator> = {
  generate: jest.fn(),
};

describe("RegisterUserUseCase", () => {
  let useCase: RegisterUserUseCase;
  const validEmail = "unique@email.com";
  const validPassword = "StrongP@ssword123";
  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterUserUseCase(
      userRepoMock,
      hasherMock,
      eventBusMock,
      idGenMock
    );
  });

  it("should register a user successfully", async () => {
    userRepoMock.existsByEmail.mockResolvedValue(false);
    hasherMock.hash.mockResolvedValue("hashedPassword");
    userRepoMock.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      email: validEmail,
      password: validPassword,
    });

    expect(result.isOk()).toBe(true);
    expect(userRepoMock.existsByEmail).toHaveBeenCalledWith(validEmail);
    expect(hasherMock.hash).toHaveBeenCalledWith(validPassword);
    expect(userRepoMock.save).toHaveBeenCalled();

    const user = result.getValue();
    expect(user).toBeUndefined();
  });

  it("should fail when email already exists", async () => {
    userRepoMock.existsByEmail.mockResolvedValue(true);

    const result = await useCase.execute({
      email: validEmail,
      password: validPassword,
    });

    expect(result.isFail()).toBe(true);
    expect(userRepoMock.existsByEmail).toHaveBeenCalledWith(validEmail);

    const error = result.getError();
    expect(error).toBeInstanceOf(EmailAlreadyTakenError);
  });

  it("should fail when password is weak", async () => {
    userRepoMock.existsByEmail.mockResolvedValue(false);

    const result = await useCase.execute({
      email: validEmail,
      password: "weakpassword",
    });

    expect(result.isFail()).toBe(true);

    const error = result.getError();
    expect(error).toBeInstanceOf(ValidationError);
  });

  it("should fail when repo save throws an error", async () => {
    userRepoMock.existsByEmail.mockResolvedValue(false);
    hasherMock.hash.mockResolvedValue("hashedPassword");
    userRepoMock.save.mockRejectedValue(new Error("DB is down"));

    const result = await useCase.execute({
      email: validEmail,
      password: validPassword,
    });

    expect(result.isFail()).toBe(true);

    const error = result.getError();
    expect(error).toBeInstanceOf(Error);
  });
});
