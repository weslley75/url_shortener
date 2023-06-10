import { UserEntity } from "./user";

describe("User", () => {
  let user: UserEntity;

  beforeEach(() => {
    user = UserEntity.create({
      name: "John Doe",
      email: "example@example.com",
      password: "12345678",
    });

    jest.spyOn(global.Date, "now").mockImplementation(() => {
      return new Date("2021-01-01T00:00:00.000Z").valueOf();
    });
  });

  it("should be able to create a new user", () => {
    expect(user).toBeInstanceOf(UserEntity);
  });

  it("should be able to create a new user with id", () => {
    const newUser = UserEntity.getUser(user);

    expect(newUser).toBeInstanceOf(UserEntity);

    expect(newUser.id).toBe(user.id);
    expect(newUser.name).toBe(user.name);
    expect(newUser.email).toBe(user.email);
    expect(newUser.password).toBe(user.password);
    expect(newUser.createdAt).toBe(user.createdAt);
    expect(newUser.updatedAt).toBe(user.updatedAt);
    expect(newUser.deletedAt).toBe(user.deletedAt);

    expect(newUser).not.toBe(user);
    expect(newUser).toEqual(user);
    expect(newUser).toMatchObject(user);
    expect(newUser).toHaveProperty("id");
  });

  it("should be able to update user name", () => {
    user.name = "Jane Doe";

    expect(user.name).toBe("Jane Doe");
  });

  it("should be able to update user email", () => {
    user.email = "example2@example.com";

    expect(user.email).toBe("example2@example.com");
  });

  it("should be able to update user password", () => {
    user.password = "87654321";

    expect(user.password).toBe("87654321");
  });

  it("should be able to delete a user", () => {
    user.delete();

    expect(user.deletedAt).toEqual(new Date("2021-01-01T00:00:00.000Z"));
  });

  it("should not be able to create a user with invalid name", () => {
    expect(() =>
      UserEntity.create({
        name: "Jo",
        email: user.email,
        password: user.password,
      })
    ).toThrow();
  });

  it("should not be able to create a user with invalid email", () => {
    expect(() =>
      UserEntity.create({
        name: user.name,
        email: "example",
        password: user.password,
      })
    ).toThrow();
  });

  it("should not be able to create a user with invalid password", () => {
    expect(() =>
      UserEntity.create({
        name: user.name,
        email: user.email,
        password: "1234567",
      })
    ).toThrow();
  });

  it("should not be able to update user name with invalid name", () => {
    expect(() => (user.name = "Jo")).toThrow();
  });

  it("should not be able to update user email with invalid email", () => {
    expect(() => (user.email = "example")).toThrowError("Invalid email");
  });

  it("should not be able to update user password with invalid password", () => {
    expect(() => (user.password = "1234567")).toThrow();
  });
});
