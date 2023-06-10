import { UserEntity } from "../../user/entity/user";
import z from "zod";

const linkSchema = z.object({
  id: z.string().min(6).regex(/^[a-zA-Z0-9]+$/),
  url: z.string().url(),
  title: z.string().min(3).optional(),
  description: z.string().min(3).optional(),
  user: z.instanceof(UserEntity).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});

type LinkInterface = z.infer<typeof linkSchema>;

type LinkProps = Omit<
  LinkInterface,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

export class LinkEntity implements LinkInterface {
  public readonly id: string;
  private _url: string;
  private _title: string | undefined;
  private _description: string | undefined;
  private readonly _user?: UserEntity;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt?: Date;

  constructor(props: LinkProps, id?: string) {
    if (!id) {
      const id = Math.random().toString(36).slice(6)
      console.log(id);
      this.id = id;
      this._createdAt = new Date(Date.now());
      this._updatedAt = new Date(Date.now());
    } else {
      this.id = id;
      this._createdAt = new Date(Date.now());
      this._updatedAt = new Date(Date.now());
    }
    this._url = props.url;
    this._title = props.title;
    this._description = props.description;
    this._user = props.user;
    linkSchema.parse(this);
  }

  static create(props: LinkProps): LinkEntity {
    return new LinkEntity(props);
  }

  static getLink(link: LinkInterface): LinkEntity {
    const instance = new LinkEntity(link, link.id);
    instance._createdAt = link.createdAt;
    instance._updatedAt = link.updatedAt;
    instance._deletedAt = link.deletedAt;
    return instance;
  }

  get url(): string {
    return this._url;
  }

  get title(): string | undefined {
    return this._title;
  }

  get description(): string | undefined {
    return this._description;
  }

  get user(): UserEntity | undefined {
    return this._user;
  }

  set url(url: string) {
    linkSchema.pick({ url: true }).parse({ url });
    this._url = url;
    this._updatedAt = new Date(Date.now());
    linkSchema.parse(this);
  }

  set title(title: string) {
    linkSchema.pick({ title: true }).parse({ title });
    this._title = title;
    this._updatedAt = new Date(Date.now());
    linkSchema.parse(this);
  }

  set description(description: string) {
    linkSchema.pick({ description: true }).parse({ description });
    this._description = description;
    this._updatedAt = new Date(Date.now());
    linkSchema.parse(this);
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  public delete(): void {
    this._deletedAt = new Date(Date.now());
  }
}
