import { UserInMemoryRepository } from "../../../infra/repositories/in-memory/user.repository";
import { UserEntity } from "../../user/entity/user";
import { UserRepository } from "../repository/user.repository";
import { GetUserByEmailUseCase } from "./get-user-by-email.use-case";
import { faker } from "@faker-js/faker";

describe("GetUserByEmailUseCase", () => {
  let useCase: GetUserByEmailUseCase;
  let userRepository: UserRepository;
  let initUser: UserEntity;

  beforeEach(async () => {
    initUser = UserEntity.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    userRepository = new UserInMemoryRepository();
    useCase = new GetUserByEmailUseCase(userRepository);

    await userRepository.create(initUser);
  });

  it("should return a user", async () => {
    const user = await useCase.execute(initUser.email);
    expect(user).toBeTruthy();
  });

  it("should return a user with the same email", async () => {
    const user = await useCase.execute(initUser.email);
    expect(user?.email).toBe(initUser.email);
  });

  it("should return undefined if user does not exists", async () => {
    const user = await useCase.execute("email_not_exists@not.exists");
    expect(user).toBeUndefined();
  });

  it("should throw if email is not provided", async () => {
    await expect(useCase.execute("")).rejects.toThrow();
  });

  it("should throw if email is not valid", async () => {
    await expect(useCase.execute("invalid_email")).rejects.toThrow();
  });
});
