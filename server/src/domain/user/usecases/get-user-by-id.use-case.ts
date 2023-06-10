import { UserRepository } from "../repository/user.repository";
import { UserOutputDto } from "./dtos/user-output.dto";

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string) {
    if (!id) {
      throw new Error("Id is required");
    }
    const user = await this.userRepository.findById(id);
    if (!user) {
      return undefined;
    }
    return new UserOutputDto(user);
  }

  async executeMany(...ids: string[]) {
    if (!ids) {
      throw new Error("Ids is required");
    }
    const users = await this.userRepository.findManyByIds(...ids);
    return users.map((user) => new UserOutputDto(user));
  }
}
