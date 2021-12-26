export const save = jest.fn().mockResolvedValue({
  id: "googleId",
  name: "googleName",
});

export const update = jest.fn().mockResolvedValue({
  id: "updatedGoogleId",
  name: "updatedGoogleName",
});

export const isExists = jest.fn().mockResolvedValue(true);
