import { PasswordHash } from "../../../../domain/common/utils/password-hash/password-hash.interface";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export class BcryptPasswordHashAdapter implements PasswordHash {
  constructor(private readonly saltRounds: number = SALT_ROUNDS) {
    if (saltRounds < 8) {
      throw new Error("Hash is too weak! Use at least 8 rounds");
    }
  }

  async hash(password: string) {
    return bcrypt.hash(password, this.saltRounds);
  }
  async compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
