/**
 * @jest-environment node
 */
import {
  addOne as addOne_,
  addMany as addMany_,
  init,
  getOne as getOne_,
  getAll as getAll_,
} from ".";
import * as path from "path";
import * as dotenv from "dotenv";
import { tags } from "../../mock/tags";

dotenv.config({ path: path.resolve(process.cwd(), ".env.portfolio") });

import { Timestamp } from "firebase-admin/firestore";

// WE CAN NOT USE JEST TO TEST THIS, CAUSE JEST DO NOT UNDERSTAND IMPORTS LIKE "firebase-admin/firestore"
// $ npm run tsc src/firestore/example.ts
// $ node src/firestore/example.js

const photosCollectionName = "photos";
const tagsCollectionName = "tags";

init();

/* const addOne = addOne_(photosCollectionName);

addOne({
  date: new Date().toUTCString(),
  _timestamp: Timestamp.fromDate(new Date()),
}).then((res) => console.log("[RESULT]", res)); */

/* const getAll = getAll_(photosCollectionName);

getAll().then((res) => console.log("[RESULT]", res)); */

/* const getOne = getOne_(photosCollectionName);

getOne("3v4xjUQHp8S4P52ifQvU").then((res) => console.log("[RESULT]", res)); */

const addMany = addMany_(tagsCollectionName);

addMany(tags)
  .then(() => console.log("SUCCESS ADD", tags))
  .catch((err: any) => console.error(err));
