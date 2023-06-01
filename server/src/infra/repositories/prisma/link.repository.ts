import { Link, PrismaClient, User } from "@prisma/client";
import { LinkRepository } from "../../../domain/repositories/link.repository";
import { LinkEntity } from "../../../domain/model/link";
import { UserEntity } from "../../../domain/model/user";

type LinkWithUser = Link & { user?: User | null };

export class LinkPrismaRepository implements LinkRepository {
  private readonly _client: PrismaClient;

  constructor() {
    this._client = new PrismaClient();
  }

  private modelToEntity(link: LinkWithUser): LinkEntity {
    let userEntity: UserEntity | undefined;
    if (link.user) {
      userEntity = UserEntity.getUser({
        ...link.user,
        deletedAt: link.user.deletedAt ?? undefined,
      });
    }

    return LinkEntity.getLink({
      id: link.id,
      url: link.url,
      title: link.title ?? undefined,
      description: link.description ?? undefined,
      updatedAt: link.updatedAt,
      createdAt: link.createdAt,
      deletedAt: link.deletedAt ?? undefined,
      user: userEntity,
    });
  }

  async create(link: LinkEntity): Promise<LinkEntity> {
    const { id, url, title, description, user } = link;
    const newLink = await this._client.link.create({
      data: {
        id,
        url,
        title,
        description,
        userId: user?.id,
      },
      include: { user: true },
    });
    return this.modelToEntity(newLink);
  }

  async update(link: LinkEntity): Promise<LinkEntity> {
    const { id, url, title, description, user } = link;
    const updatedLink = await this._client.link.update({
      where: { id },
      data: {
        url,
        title,
        description,
        userId: user?.id,
      },
      include: { user: true },
    });
    return this.modelToEntity(updatedLink);
  }

  async delete(id: string): Promise<void> {
    await this._client.link.delete({
      where: { id },
      include: { user: true },
    });
  }

  async findById(id: string): Promise<LinkEntity | undefined> {
    const link = await this._client.link.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!link) return undefined;
    return this.modelToEntity(link);
  }

  async findByUserId(userId?: string): Promise<LinkEntity[]> {
    const links = await this._client.link.findMany({
      where: { userId },
      include: { user: true },
    });
    return links.map((link) => {
      return this.modelToEntity(link);
    });
  }
}
