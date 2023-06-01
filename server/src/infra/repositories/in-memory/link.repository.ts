import { LinkEntity } from "../../../domain/model/link";
import { LinkRepository } from "../../../domain/repositories/link.repository";

export class LinkInMemoryRepository implements LinkRepository {
  private links: LinkEntity[] = [];

  async create(link: LinkEntity): Promise<LinkEntity> {
    this.links.push(link);
    return link;
  }

  async update(link: LinkEntity): Promise<LinkEntity> {
    const index = this.links.findIndex((l) => l.id === link.id);
    this.links[index] = link;
    return link;
  }

  async findById(id: string): Promise<LinkEntity | undefined> {
    return this.links.find((l) => l.id === id);
  }

  async findByUserId(userId?: string): Promise<LinkEntity[]> {
    return this.links.filter((l) => l.user?.id === userId);
  }

  async delete(id: string): Promise<void> {
    const index = this.links.findIndex((l) => l.id === id);
    this.links.splice(index, 1);
  }
}
