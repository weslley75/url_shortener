import { PasswordHash } from "../../common/utils/password-hash/password-hash.interface";
import { UserEntity } from "../../user/entity/user";
import { UserRepository } from "../repository/user.repository";
import { CreateUserInputDto } from "./dtos/create-user.dto";

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: PasswordHash
  ) {}

  async execute(payload: CreateUserInputDto) {
    if (!payload.name) {
      throw new Error("Name is required");
    }
    if (!payload.email) {
      throw new Error("Email is required");
    }
    if (!payload.password) {
      throw new Error("Password is required");
    }

    const hashedPassword = await this.hashService.hash(payload.password);
    
    const user = UserEntity.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    });

    await this.userRepository.create(user);
  }
}
