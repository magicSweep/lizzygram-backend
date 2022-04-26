export type GetExpirationDateFromFirestore = (
  collectionName: string,
  docId: string
) => Promise<Date>;

export type SaveNewExpirationDateToFirestore = (
  collectionName: string,
  docId: string,
  newDate: Date
) => Promise<boolean>;

export type GetExpirationDateFromFs = (pathToFile: string) => Promise<Date>;

export type SaveNewExpirationDateToFs = (
  pathToFile: string,
  newDate: Date
) => Promise<void>;

export type IsDateExpired = (expirationDate: Date) => boolean;

export type CalcNewExpirationDate = (daysToNextCleanup: number) => Date;

export type SendRequestToCleanupService = (url: string) => Promise<void>;
