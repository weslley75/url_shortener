import { z } from "zod";
import { UserRepository } from "../repository/user.repository";
import { UserOutputDto } from "./dtos/user-output.dto";

export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string) {
    if (!email) {
      throw new Error("Email is required");
    }
    const emailValid = z.string().email().safeParse(email);
    if (!emailValid.success) {
      throw new Error("Invalid email");
    }
    const user = await this.userRepository.findByEmail(email);
    if (!user) return undefined;

    return new UserOutputDto(user);
  }
}
