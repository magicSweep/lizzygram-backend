//const express = require('express')
import express from "express";
import { compose } from "fmagic";

const port: number = 3000;

const hello = compose(() => {});

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
