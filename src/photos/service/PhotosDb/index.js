"use strict";
exports.__esModule = true;
exports.removePhoto = exports.updatePhoto = exports.getPhoto = exports.addPhoto = void 0;
/* import {
  getOne,
  updateOne,
  deleteOne,
} from "../../../firestore/firestore.fake"; */
var firestore_1 = require("../../../firestore");
var config_1 = require("../../../config");
exports.addPhoto = (0, firestore_1.addOne)(config_1.photosCollectionName);
exports.getPhoto = (0, firestore_1.getOne)(config_1.photosCollectionName);
exports.updatePhoto = (0, firestore_1.updateOne)(config_1.photosCollectionName);
exports.removePhoto = (0, firestore_1.deleteOne)(config_1.photosCollectionName);
