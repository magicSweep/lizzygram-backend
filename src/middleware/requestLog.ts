import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";

export const requestLog =
  (logger: Logger) => (req: Request, res: Response, next: NextFunction) => {
    logger.log("info", "REQUEST", {
      METHOD: req.method,
      PATH: req.path,
      REQUEST_BODY: req.body,
      REQUEST_QUERY: req.query,
    });

    next();
  };
