import { addValues, getUuid } from "../../../src/utilities/appUtils";

describe("is working", () => {
  it("should work", () => {
    expect(true).toBeTruthy();
  });
});

describe("addValues Method", () => {
  it("1 + 1 should equal 2", () => {
    expect(addValues(1, 1)).toEqual(2);
  });
});

describe("getUuid Method", () => {
  it("uuid should contain 36 characters", () => {
    const uuid: string = getUuid();
    expect(uuid.length).toBe(36);
  });
});
