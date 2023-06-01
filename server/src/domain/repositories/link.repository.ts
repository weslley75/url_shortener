import { LinkEntity } from "../model/link";

export interface LinkRepository {
  create(url: LinkEntity): Promise<LinkEntity>;
  update(url: LinkEntity): Promise<LinkEntity>;
  findById(id: string): Promise<LinkEntity | undefined>;
  findByUserId(userId?: string): Promise<LinkEntity[]>;
  delete(id: string): Promise<void>;
}
