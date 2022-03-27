import { join } from "path";

// photos
export const photosCollectionName = "photos";
export const usersCollectionName = "users";
/// export const PHOTOS_FIRESTORE_COLLECTION_NAME =
//  process.env.NODE_ENV === "test" ? "phototest" : "photos";
//export const PHOTOS_FIRESTORE_COLLECTION_NAME = "photos";
//export const TAGS_FIRESTORE_COLLECTION_NAME = "tags";

export const pathToOptimizedPhotosDir = join(process.cwd(), "temp");
export const pathToUploadFilesDir = join(process.cwd(), "upload");

// EXPRESS PATHS

//export const selfDomainNameHeroku = "lizzygram.herokuapp.com";
//export const selfDomainNameLocal = "localhost";

//export const port = 80;

export const addPhotoUrl = "add-photo";
export const editPhotoUrl = "edit-photo";
// Dyno do not sleep
//export const herokuPingUrl = "/sleep_q23we4rt5";
// Download original photo from google drive
export const downloadPhotoUrl = "/download/:photoQuery/:fileName";

//export const photoWidths = [400, 800, 1200, 1600, 1900];
//export const photoHeights = [300, 600, 700, 900, 1000];

export const photoSizes = [
  { width: 320, height: 180 },
  { width: 800, height: 640 },
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 },
  { width: 3840, height: 2160 },
];

// VALIDATION

export const descRegex = /[a-zA-ZА-Яа-я 0-9:?!(),.-]*/;
export const descMaxLength = 3000;

export const birthDate = new Date("2018-07-07");
