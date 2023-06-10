import { UserEntity } from "../entity/user";

export interface UserRepository {
  create(user: UserEntity): Promise<UserEntity>;
  update(user: UserEntity): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | undefined>;
  findByEmail(email: string): Promise<UserEntity | undefined>;
  findManyByIds(...ids: string[]): Promise<UserEntity[]>;
}
