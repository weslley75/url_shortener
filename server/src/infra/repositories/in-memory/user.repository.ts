import { UserEntity } from "../../../domain/model/user";
import { UserRepository } from "../../../domain/repositories/user.repository";

export class UserInMemoryRepository implements UserRepository {
  private users: UserEntity[] = [];

  async create(user: UserEntity): Promise<UserEntity> {
    this.users.push(user);
    return user;
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const index = this.users.findIndex((u) => u.id === user.id);
    this.users[index] = user;
    return user;
  }

  async findById(id: string): Promise<UserEntity | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async findManyByIds(ids: string[]): Promise<UserEntity[]> {
    return this.users.filter((u) => ids.includes(u.id));
  }
}
