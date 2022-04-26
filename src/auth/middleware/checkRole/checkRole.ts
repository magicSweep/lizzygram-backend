import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import { UserDb } from "../../service/UserDb/types";
import { compose, elif, then, _catch } from "fmagic";
import { AuthUser } from "../../service/Auth/types";

export type CheckRoleData = {
  user: AuthUser;
  exists: boolean;
};

export const checkRoleMiddleware =
  (userExists: UserDb["exists"]) =>
  (logger: Logger) =>
  async (req: Request, res: Response, next: NextFunction) =>
    compose(
      () => ({
        user: (req as any).user,
      }),
      async (data: CheckRoleData) => ({
        ...data,
        exists: await userExists(data.user.uid),
      }),
      then(
        elif(
          ({ exists }: CheckRoleData) => exists === false,
          (data: CheckRoleData) => {
            logger.log("info", "USER NOT EDITOR");

            res.status(403).end();
          },
          (data: CheckRoleData) => {
            logger.log("info", "USER IS EDITOR");

            (req as any).user.isEditor = true;

            next();
          }
        )
      ),
      _catch((err: any) => {
        logger.log("error", "CHECK ROLE ERROR", {
          METHOD: req.method,
          PATH: req.path,
          USER: (req as any).user,
          ERROR: err,
        });

        res.status(500).end();
      })
    )();
