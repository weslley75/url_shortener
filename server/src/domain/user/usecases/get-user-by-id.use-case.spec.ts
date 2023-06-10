import { faker } from "@faker-js/faker";
import { UserInMemoryRepository } from "../../../infra/repositories/in-memory/user.repository";
import { UserEntity } from "../entity/user";
import { UserRepository } from "../repository/user.repository";
import { GetUserByIdUseCase } from "./get-user-by-id.use-case";

describe("GetUserByIdUseCase", () => {
  let useCase: GetUserByIdUseCase;
  let repository: UserRepository;
  let initUser: UserEntity;

  beforeEach(async () => {
    initUser = UserEntity.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    repository = new UserInMemoryRepository();
    useCase = new GetUserByIdUseCase(repository);

    await repository.create(initUser);
  });

  it("should return a user", async () => {
    const user = await useCase.execute(initUser.id);
    expect(user).toBeTruthy();
  });

  it("should return a user with the same id", async () => {
    const user = await useCase.execute(initUser.id);
    expect(user?.id).toBe(initUser.id);
  });

  it("should return undefined if user does not exists", async () => {
    const user = await useCase.execute("id_not_exists");
    expect(user).toBeUndefined();
  });

  it("should throw if id is not provided", async () => {
    await expect(useCase.execute("")).rejects.toThrow();
  });
});
