import { UserInMemoryRepository } from "../../../infra/repositories/in-memory/user.repository";
import { UserEntity } from "../../user/entity/user";
import { UserRepository } from "../repository/user.repository";
import { GetUserByEmailUseCase } from "./get-user-by-email.use-case";

describe("GetUserByEmailUseCase", () => {
  let useCase: GetUserByEmailUseCase;
  let userRepository: UserRepository;

  beforeEach(async () => {
    let initUser = UserEntity.create({
      name: "any_name",
      email: "example@example.org",
      password: "any_password",
    });

    userRepository = new UserInMemoryRepository();
    useCase = new GetUserByEmailUseCase(userRepository);

    await userRepository.create(initUser);
  });

  it("should return a user", async () => {
    const user = await useCase.execute("example@example.org");
    expect(user).toBeTruthy();
  });

  it("should return a user with the same email", async () => {
    const user = await useCase.execute("example@example.org");
    expect(user?.email).toBe("example@example.org");
  });

  it("should return undefined if user does not exists", async () => {
    const user = await useCase.execute("teste@email.com");
    expect(user).toBeUndefined();
  });

  it("should throw if email is not provided", async () => {
    await expect(useCase.execute("")).rejects.toThrow();
  });
});
