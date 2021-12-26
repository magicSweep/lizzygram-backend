"use strict";
exports.__esModule = true;
/**
 * @jest-environment node
 */
var _1 = require(".");
var dotenv = require("dotenv");
// WE CAN NOT USE JEST TO TEST THIS, CAUSE JEST DO NOT UNDERSTAND IMPORTS LIKE "firebase-admin/firestore"
// $ npm run tsc src/firestore/example.ts
// $ node src/firestore/example.js
var photosCollectionName = "photos";
dotenv.config();
(0, _1.init)();
/* const addOne = addOne_(photosCollectionName);

addOne({
  date: new Date().toUTCString(),
  _timestamp: Timestamp.fromDate(new Date()),
}).then((res) => console.log("[RESULT]", res)); */
/* const getAll = getAll_(photosCollectionName);

getAll().then((res) => console.log("[RESULT]", res)); */
var getOne = (0, _1.getOne)(photosCollectionName);
getOne("1640123290892").then(function (res) { return console.log("[RESULT]", res); });
