import express, { Request, Response, NextFunction } from "express";
import { WorkerResponse } from "lizzygram-common-data/dist/types";
import { Logger } from "winston";

export const errorHandler =
  (logger: Logger) =>
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.log("error", "[GLOBAL_ERROR_HANDLER]", {
      METHOD: req.method,
      PATH: req.path,
      REQUEST_BODY: req.body,
      REQUEST_QUERY: req.query,
      ERROR: err,
    });

    const json: WorkerResponse = {
      status: "error",
    };

    res.status(200).json(json).end();
  };

/* export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message = "";

  if (err.message) {
    message = `
          MESSAGE - ${err.message} 
          NAME - ${err.name}
          FILENAME - ${(err as any).filename}
          LINENUMBER - ${(err as any).lineNumber}
          STACK - ${err.stack}
        `;
  } else {
    message = JSON.stringify(err);
  }

  message = `
        REQUEST_PATH - ${req.path}
        REQUEST_BODY - ${req.body ? JSON.stringify(req.body) : "NO BODY"}
        ${message}
      `;

  console.log(`[GLOBAL_ERROR_HANDLER] ${message}`);

  const json: WorkerResponse = {
    status: "error",
    data: {
      error: message,
    },
  };

  res.status(200).json(json).end();
};
 */
