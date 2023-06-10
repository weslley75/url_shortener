import { ArgonPasswordHashAdapter } from "../../../infra/adapters/password-hash/argon2/argon-password-hash.adapter";
import { UserInMemoryRepository } from "../../../infra/repositories/in-memory/user.repository";
import { PasswordHash } from "../../common/utils/password-hash/password-hash.interface";
import { UserRepository } from "../repository/user.repository";
import { CreateUserUseCase } from "./create-user.use-case";

const defaultUser = {
  name: "Example",
  email: "example@example.com",
  password: "123456",
};

describe("CreateUserUseCase", () => {
  let useCase: CreateUserUseCase;
  let repository: UserRepository;
  let hashService: PasswordHash;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashService = new ArgonPasswordHashAdapter();
    useCase = new CreateUserUseCase(repository, hashService);
  });

  it("should be able to create a new user", async () => {
    const payload = defaultUser;

    await useCase.execute(payload);

    const user = await repository.findByEmail(payload.email);

    console.log(user?.password);

    expect(user).toBeDefined();
    expect(user?.id).toBeDefined();
    expect(user?.name).toBe(payload.name);
    expect(user?.email).toBe(payload.email);
    expect(user?.password).not.toBe(payload.password);
    expect(user?.password).toBeDefined();
    expect(hashService.compare(payload.password, user?.password!)).toBeTruthy();
    expect(user?.createdAt).toBeDefined();
    expect(user?.updatedAt).toBeDefined();
    expect(user?.deletedAt).toBeUndefined();
  });

  it("should not be able to create a new user without name", async () => {
    const payload = {
      ...defaultUser,
      name: "",
    };

    await expect(useCase.execute(payload)).rejects.toThrowError(
      "Name is required"
    );
  });

  it("should not be able to create a new user without email", async () => {
    const payload = {
      ...defaultUser,
      email: "",
    };

    await expect(useCase.execute(payload)).rejects.toThrowError(
      "Email is required"
    );
  });

  it("should not be able to create a new user without password", async () => {
    const payload = {
      ...defaultUser,
      password: "",
    };

    await expect(useCase.execute(payload)).rejects.toThrowError(
      "Password is required"
    );
  });

  it("should not be able to create a new user with same email", async () => {
    const payload = defaultUser;

    await useCase.execute(payload);

    await expect(useCase.execute(payload)).rejects.toThrowError(
      "User already exists"
    );
  });

  it("should not be able to create a new user with invalid email", async () => {
    const payload = {
      ...defaultUser,
      email: "invalid_email",
    };

    await expect(useCase.execute(payload)).rejects.toThrowError(
      "Invalid email"
    );
  });
});
