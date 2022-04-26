import { isDateExpired, calcNewExpirationDate } from "./cleanup.helper";

describe.skip("calcNewExpirationDate", () => {
  test("", () => {
    const newDate = calcNewExpirationDate(7);

    expect(newDate.toUTCString()).toEqual("he");
  });
});

describe("isDateExpired", () => {
  test("", () => {
    let expirationDate = new Date();

    expirationDate.setDate(expirationDate.getDate() + 1);

    expect(isDateExpired(expirationDate)).toEqual(true);

    expirationDate = new Date();

    expirationDate.setDate(expirationDate.getDate() - 1);

    expect(isDateExpired(expirationDate)).toEqual(false);
  });
});
