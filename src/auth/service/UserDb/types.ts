export type UserDb = {
  exists: (userUid: string) => Promise<boolean>;
};
