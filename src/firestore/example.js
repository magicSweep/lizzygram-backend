"use strict";
exports.__esModule = true;
/**
 * @jest-environment node
 */
var _1 = require(".");
var path = require("path");
var dotenv = require("dotenv");
var tags_1 = require("../mock/tags");
dotenv.config({ path: path.resolve(process.cwd(), ".env.portfolio") });
// WE CAN NOT USE JEST TO TEST THIS, CAUSE JEST DO NOT UNDERSTAND IMPORTS LIKE "firebase-admin/firestore"
// $ npm run tsc src/firestore/example.ts
// $ node src/firestore/example.js
var photosCollectionName = "photos";
var tagsCollectionName = "tags";
(0, _1.init)();
/* const addOne = addOne_(photosCollectionName);

addOne({
  date: new Date().toUTCString(),
  _timestamp: Timestamp.fromDate(new Date()),
}).then((res) => console.log("[RESULT]", res)); */
/* const getAll = getAll_(photosCollectionName);

getAll().then((res) => console.log("[RESULT]", res)); */
/* const getOne = getOne_(photosCollectionName);

getOne("3v4xjUQHp8S4P52ifQvU").then((res) => console.log("[RESULT]", res)); */
var addMany = (0, _1.addMany)(tagsCollectionName);
addMany(tags_1.tags)
    .then(function () { return console.log("SUCCESS ADD", tags_1.tags); })["catch"](function (err) { return console.error(err); });
