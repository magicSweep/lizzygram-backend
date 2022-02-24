"use strict";
exports.__esModule = true;
exports.birthDate = exports.descMaxLength = exports.descRegex = exports.photoSizes = exports.downloadPhotoUrl = exports.editPhotoUrl = exports.addPhotoUrl = exports.pathToUploadFilesDir = exports.pathToOptimizedPhotosDir = exports.usersCollectionName = exports.photosCollectionName = void 0;
var path_1 = require("path");
// photos
exports.photosCollectionName = "photos";
exports.usersCollectionName = "users";
/// export const PHOTOS_FIRESTORE_COLLECTION_NAME =
//  process.env.NODE_ENV === "test" ? "phototest" : "photos";
//export const PHOTOS_FIRESTORE_COLLECTION_NAME = "photos";
//export const TAGS_FIRESTORE_COLLECTION_NAME = "tags";
exports.pathToOptimizedPhotosDir = (0, path_1.join)(process.cwd(), "temp");
exports.pathToUploadFilesDir = (0, path_1.join)(process.cwd(), "upload");
// EXPRESS PATHS
//export const selfDomainNameHeroku = "lizzygram.herokuapp.com";
//export const selfDomainNameLocal = "localhost";
//export const port = 80;
exports.addPhotoUrl = "add-photo";
exports.editPhotoUrl = "edit-photo";
// Dyno do not sleep
//export const herokuPingUrl = "/sleep_q23we4rt5";
// Download original photo from google drive
exports.downloadPhotoUrl = "/download/:photoQuery";
//export const photoWidths = [400, 800, 1200, 1600, 1900];
//export const photoHeights = [300, 600, 700, 900, 1000];
exports.photoSizes = [
    { width: 320, height: 180 },
    { width: 800, height: 640 },
    { width: 1280, height: 720 },
    { width: 1920, height: 1080 },
    { width: 3840, height: 2160 },
];
// VALIDATION
exports.descRegex = /[a-zA-ZА-Яа-я 0-9:?!(),.-]*/;
exports.descMaxLength = 3000;
exports.birthDate = new Date("2018-07-07");
