import { PasswordHash } from "../../../../domain/common/utils/password-hash/password-hash.interface";
import argon2 from "argon2";

export class ArgonPasswordHashAdapter extends PasswordHash {
  async hash(password: string) {
    return argon2.hash(password);
  }
  async compare(password: string, hash: string) {
    return argon2.verify(hash, password);
  }
}
