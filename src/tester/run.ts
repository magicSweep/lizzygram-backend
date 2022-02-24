const dotenv = require("dotenv");
import { resolve } from "path";
import { testDownloadPhoto, testAddPhoto, testEditPhoto } from ".";
import { init as initFirestore } from "./../firestore";
//import { init as initGoogleDrive } from "./../googleDrive";
//import { init as initCloudinary } from "./../cloudinary";

const main = async () => {
  dotenv.config({ path: resolve(process.cwd(), ".env.portfolio") });

  initFirestore();

  //await testDownloadPhoto();

  //await testAddPhoto();

  await testEditPhoto();
};

main();

//;
