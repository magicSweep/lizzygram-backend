import { Request, Response, NextFunction } from "express";

export const mainLog = (req: Request, res: Response, next: NextFunction) => {
  console.log("------------------");
  console.log();
  console.log(`METHOD - ${req.method}`);
  console.log(`PATH - ${req.path}`);

  if (req.body) {
    console.log("REQUEST BODY:");
    for (let prop in req.body) {
      console.log(` - ${prop} - ${req.body[prop]}`);
    }
  } else {
    console.log("REQUEST BODY: NULL");
  }

  if (req.query) {
    console.log("REQUEST QUERY:");
    for (let prop in req.query) {
      console.log(` - ${prop} - ${req.query[prop]}`);
    }
  } else {
    console.log("REQUEST QUERY: NULL");
  }

  console.log();
  console.log("------------------");

  next();
};
