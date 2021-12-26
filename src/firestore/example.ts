/**
 * @jest-environment node
 */
import {
  addOne as addOne_,
  init,
  getOne as getOne_,
  getAll as getAll_,
} from ".";
import * as dotenv from "dotenv";
import { Timestamp } from "firebase-admin/firestore";

// WE CAN NOT USE JEST TO TEST THIS, CAUSE JEST DO NOT UNDERSTAND IMPORTS LIKE "firebase-admin/firestore"
// $ npm run tsc src/firestore/example.ts
// $ node src/firestore/example.js

const photosCollectionName = "photos";

dotenv.config();

init();

/* const addOne = addOne_(photosCollectionName);

addOne({
  date: new Date().toUTCString(),
  _timestamp: Timestamp.fromDate(new Date()),
}).then((res) => console.log("[RESULT]", res)); */

/* const getAll = getAll_(photosCollectionName);

getAll().then((res) => console.log("[RESULT]", res)); */

const getOne = getOne_(photosCollectionName);

getOne("1640123290892").then((res) => console.log("[RESULT]", res));
