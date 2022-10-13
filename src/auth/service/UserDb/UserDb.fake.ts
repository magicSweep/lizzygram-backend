import wait from "waait";

export const exists: (userUid: string) => Promise<boolean> = async (
  userUid
) => {
  await wait(1000);

  console.log("FAKE USER ROLE EXISTS", userUid);

  return true;
};
