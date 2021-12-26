export const getPhoto = jest.fn().mockResolvedValue("photo");
export const updatePhoto = jest
  .fn()
  .mockImplementation(() => Promise.resolve(true));
