import { LinkEntity } from "./link";
import { UserEntity } from "../../user/entity/user";

const userExample: UserEntity = UserEntity.create({
  name: "John Doe",
  email: "example@example.com",
  password: "12345678",
});

describe("Link", () => {
  let link: LinkEntity;

  beforeEach(() => {
    link = LinkEntity.create({
      url: "https://example.com",
      title: "Example",
      description: "Example",
      user: userExample,
    });

    jest.spyOn(global.Date, "now").mockImplementation(() => {
      return new Date("2021-01-01T00:00:00.000Z").valueOf();
    });
  });

  it("should be able to create a new link", () => {
    expect(link).toBeInstanceOf(LinkEntity);
  });

  it("should be able to create a new link with id", () => {
    const newLink = LinkEntity.getLink(link);

    expect(newLink).toBeInstanceOf(LinkEntity);

    expect(newLink.id).toBe(link.id);
    expect(newLink.url).toBe(link.url);
    expect(newLink.title).toBe(link.title);
    expect(newLink.description).toBe(link.description);
    expect(newLink.user).toBe(link.user);
    expect(newLink.createdAt).toBe(link.createdAt);
    expect(newLink.updatedAt).toBe(link.updatedAt);
    expect(newLink.deletedAt).toBe(link.deletedAt);

    expect(newLink).not.toBe(link);
    expect(newLink).toEqual(link);
    expect(newLink).toMatchObject(link);
    expect(newLink).toHaveProperty("id");
  });

  it("should be able to update link url", () => {
    link.url = "https://example2.com";

    expect(link.url).toBe("https://example2.com");
  });

  it("should be able to update link title", () => {
    link.title = "Example 2";

    expect(link.title).toBe("Example 2");
  });

  it("should be able to update link description", () => {
    link.description = "Example 2";

    expect(link.description).toBe("Example 2");
  });

  it("should be able to delete a link", () => {
    link.delete();

    expect(link.deletedAt).not.toBeUndefined();
  });

  it("should throw an error when try to create a new link with invalid url", () => {
    expect(() => {
      LinkEntity.create({
        url: "example",
        title: "Example",
        description: "Example",
        user: userExample,
      });
    }).toThrowError();
  });

  it("should throw an error when try to update link url with invalid url", () => {
    expect(() => {
      link.url = "example";
    }).toThrowError();
  });

  it("should throw an error when try to update link title with invalid title", () => {
    expect(() => {
      link.title = "Ex";
    }).toThrowError();
  });

  it("should throw an error when try to update link description with invalid description", () => {
    expect(() => {
      link.description = "Ex";
    }).toThrowError();
  });

  it("should throw an error when try to create a new link with invalid user", () => {
    expect(() => {
      LinkEntity.create({
        url: "https://example.com",
        title: "Example",
        description: "Example",
        user: {} as UserEntity,
      });
    }).toThrowError();
  });
});
