import { faker } from "@faker-js/faker";
import { ArgonPasswordHashAdapter } from "../../../infra/adapters/password-hash/argon2/argon-password-hash.adapter";
import { UserInMemoryRepository } from "../../../infra/repositories/in-memory/user.repository";
import { PasswordHash } from "../../common/utils/password-hash/password-hash.interface";
import { UserRepository } from "../repository/user.repository";
import { ValidateLoginUseCase } from "./validate-login.use-case";
import { CreateUserUseCase } from "./create-user.use-case";
import { CreateUserInputDto } from "./dtos/create-user.dto";

const wrongValues = {
  email: "wrong_email@com.br",
  password: "wrong_password",
};

describe("ValidateLoginUseCase", () => {
  let loginUseCase: ValidateLoginUseCase;
  let createUseCase: CreateUserUseCase;
  let repository: UserRepository;
  let hashService: PasswordHash;
  let defaultUser: CreateUserInputDto;

  beforeEach(async () => {
    repository = new UserInMemoryRepository();
    hashService = new ArgonPasswordHashAdapter();
    loginUseCase = new ValidateLoginUseCase(repository, hashService);
    createUseCase = new CreateUserUseCase(repository, hashService);

    defaultUser = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await createUseCase.execute(defaultUser);
  });

  it("should be able to validate login", async () => {
    const user = await loginUseCase.execute(
      defaultUser.email,
      defaultUser.password
    );

    expect(user).toBeDefined();
    expect(user?.id).toBeDefined();
    expect(user?.name).toBe(defaultUser.name);
    expect(user?.email).toBe(defaultUser.email);
  });

  it("should not be able to validate login with wrong email", async () => {
    await expect(
      loginUseCase.execute(wrongValues.email, defaultUser.password)
    ).rejects.toThrowError("Wrong email or password");
  });

  it("should not be able to validate login with wrong password", async () => {
    await expect(
      loginUseCase.execute(defaultUser.email, wrongValues.password)
    ).rejects.toThrowError("Wrong email or password");
  });

  it("should not be able to validate login with wrong email and password", async () => {
    await expect(
      loginUseCase.execute(wrongValues.email, wrongValues.password)
    ).rejects.toThrowError("Wrong email or password");
  });

  it("should not be able to validate login without email", async () => {
    await expect(
      loginUseCase.execute("", defaultUser.password)
    ).rejects.toThrowError("Email is required");
  });

  it("should not be able to validate login with email invalid", async () => {
    await expect(
      loginUseCase.execute("email_invalid", defaultUser.password)
    ).rejects.toThrowError("Invalid email");
  });

  it("should not be able to validate login without password", async () => {
    await expect(
      loginUseCase.execute(defaultUser.email, "")
    ).rejects.toThrowError("Password is required");
  });

  it("should not be able to validate login without email and password", async () => {
    await expect(loginUseCase.execute("", "")).rejects.toThrowError(
      "Email is required"
    );
  });
});
