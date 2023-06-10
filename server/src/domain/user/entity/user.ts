import crypto from "node:crypto";
import z from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});

type UserInterface = z.infer<typeof userSchema>;

type UserProps = Omit<
  UserInterface,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

export class UserEntity implements UserInterface {
  public readonly id: string;
  private _name: string;
  private _email: string;
  private _password: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt?: Date;

  constructor(props: UserProps, id?: string) {
    if (!id) {
      this.id = crypto.randomUUID();
      this._createdAt = new Date(Date.now());
      this._updatedAt = new Date(Date.now());
    } else {
      this.id = id;
      this._createdAt = new Date(Date.now());
      this._updatedAt = new Date(Date.now());
    }
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    userSchema.parse(this);
  }

  static create(props: UserProps): UserEntity {
    return new UserEntity(props);
  }

  static getUser(user: UserInterface): UserEntity {
    const instance = new UserEntity(user, user.id);
    instance._createdAt = user.createdAt;
    instance._updatedAt = user.updatedAt;
    instance._deletedAt = user.deletedAt;
    return instance;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  set name(name: string) {
    userSchema.pick({ name: true }).parse({ name });
    this._name = name;
    this._updatedAt = new Date(Date.now());
    userSchema.parse(this);
  }

  set email(email: string) {
    userSchema.pick({ email: true }).parse({ email });
    this._email = email;
    this._updatedAt = new Date(Date.now());
    userSchema.parse(this);
  }

  set password(password: string) {
    userSchema.pick({ password: true }).parse({ password });
    this._password = password;
    this._updatedAt = new Date(Date.now());
    userSchema.parse(this);
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
