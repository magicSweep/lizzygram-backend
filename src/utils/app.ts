export const millisecondsToYears = (mSeconds: number) => {
  return Math.floor(mSeconds / 31536000000);
};

export const getLizzyYearsOld = () => {
  const birthday = new Date("2018-07-07");

  const now = new Date();

  const mSeconds = now.getTime() - birthday.getTime();

  return millisecondsToYears(mSeconds);
};

export const getYearsOld = (date: Date) => {
  const birthday = new Date("2018-07-07");

  //console.log("Date", date.getTime(), birthday.getTime());

  const mSeconds = date.getTime() - birthday.getTime();

  //console.log("mSeconds", mSeconds);

  //console.log("result", mSeconds / 31536000000);

  return millisecondsToYears(mSeconds);
};
