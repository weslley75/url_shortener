import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserEntity } from "../../../domain/model/user";
import { PrismaClient } from "@prisma/client";

export class UserPrismaRepository implements UserRepository {
  private readonly _client: PrismaClient;

  constructor() {
    this._client = new PrismaClient();
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const { id, name, email, password } = user;
    const newUser = await this._client.user.create({
      data: {
        id,
        name,
        email,
        password,
      },
    });
    return UserEntity.getUser({
      ...newUser,
      deletedAt: newUser.deletedAt ?? undefined,
    });
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const { id, name, email, password } = user;
    const updatedUser = await this._client.user.update({
      where: { id },
      data: {
        name,
        email,
        password,
      },
    });
    return UserEntity.getUser({
      ...updatedUser,
      deletedAt: updatedUser.deletedAt ?? undefined,
    });
  }

  async delete(user: UserEntity): Promise<UserEntity> {
    const { id } = user;
    const deletedUser = await this._client.user.delete({
      where: { id },
    });
    return UserEntity.getUser({
      ...deletedUser,
      deletedAt: deletedUser.deletedAt ?? undefined,
    });
  }

  async findById(id: string): Promise<UserEntity | undefined> {
    const user = await this._client.user.findUnique({
      where: { id },
    });
    if (!user) return undefined;
    return UserEntity.getUser({
      ...user,
      deletedAt: user.deletedAt ?? undefined,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    const user = await this._client.user.findUnique({
      where: { email },
    });
    if (!user) return undefined;
    return UserEntity.getUser({
      ...user,
      deletedAt: user.deletedAt ?? undefined,
    });
  }

  async findManyByIds(ids: string[]): Promise<UserEntity[]> {
    const users = await this._client.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return users.map((user) =>
      UserEntity.getUser({
        ...user,
        deletedAt: user.deletedAt ?? undefined,
      })
    );
  }
}
