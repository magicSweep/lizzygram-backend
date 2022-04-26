import wait from "waait";

export const exists: (userUid: string) => Promise<boolean> = async (
  userUid
) => {
  await wait(1000);

  return true;
};
