import { generateRandomString } from "./link-id-generator";

describe("test server", function () {
  it("test server.generateRandomString", function () {
    let result = generateRandomString(10);
    expect(result.length).toBe(10);
  });
});
