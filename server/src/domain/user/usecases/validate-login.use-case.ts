import { z } from "zod";
import { PasswordHash } from "../../common/utils/password-hash/password-hash.interface";
import { UserRepository } from "../repository/user.repository";
import { UserOutputDto } from "./dtos/user-output.dto";

export class ValidateLoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHash: PasswordHash
  ) {}

  async execute(email: string, password: string) {
    if (!email) {
      throw new Error("Email is required");
    }
    const emailValid = z.string().email().safeParse(email);
    if (!emailValid.success) {
      throw new Error("Invalid email");
    }
    if (!password) {
      throw new Error("Password is required");
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await this.passwordHash.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return new UserOutputDto(user);
  }
}
