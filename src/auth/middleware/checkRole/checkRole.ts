import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import { UserDb } from "../../service/UserDb/types";
import {
  chain,
  compose,
  Done,
  elif,
  NI_Next,
  then,
  thenDoneFold,
  _catch,
} from "fmagic";
import { AuthUser } from "../../service/Auth/types";

export type CheckRoleData = {
  user: AuthUser;
  savedExists: boolean | null;
  exists: boolean;
};

type SessionStorage = {
  getRole: (
    logger: any
  ) => (props: { userUid: string }) => Promise<boolean | null>;
  saveRole: (
    logger: any
  ) => (props: { userUid: string; isEditor: boolean }) => Promise<void>;
};

const onEditorSuccess = (req: any, res: any, next: any, logger: any) =>
  elif<CheckRoleData, void>(
    ({ savedExists, exists }: CheckRoleData) =>
      savedExists === null ? exists === false : savedExists === false,
    (data: CheckRoleData) => {
      logger.log("info", "USER NOT EDITOR");

      res.status(403).end();
    },
    (data: CheckRoleData) => {
      logger.log("info", "USER IS EDITOR");

      (req as any).user.isEditor = true;

      next();
    }
  );

export const checkRoleMiddleware =
  (userExists: UserDb["exists"], sessionStorage: SessionStorage) =>
  (logger: Logger) =>
  async (req: Request, res: Response, next: NextFunction) =>
    compose(
      () => ({
        user: (req as any).user,
      }),
      async (data: CheckRoleData) => ({
        ...data,
        savedExists: await sessionStorage.getRole(logger)({
          userUid: data.user.uid,
        }),
      }),
      then((data: CheckRoleData) =>
        data.savedExists === null ? NI_Next.of(data) : Done.of(data)
      ),
      then(
        chain(
          compose(
            async (data: CheckRoleData) => ({
              ...data,
              exists: await userExists(data.user.uid),
            }),
            then(NI_Next.of),
            _catch((err: any) => Done.of({ error: err }))
          )
        )
      ),
      thenDoneFold(
        (data: CheckRoleData & { error: any }) => {
          // does not need to save to session storage

          if (data.error !== undefined) {
            logger.log("error", "CHECK ROLE ERROR", {
              METHOD: req.method,
              PATH: req.path,
              USER: (req as any).user,
              ERROR: data.error,
            });

            res.status(500).end();
          } else {
            onEditorSuccess(req, res, next, logger)(data);
          }
        },
        (data: CheckRoleData) => {
          // need to save to session storage
          sessionStorage.saveRole(logger)({
            userUid: data.user.uid,
            isEditor: data.exists,
          });

          onEditorSuccess(req, res, next, logger)(data);
        }
      )
    )();

/* export const checkRoleMiddleware =
  (userExists: UserDb["exists"], sessionStorage: SessionStorage) =>
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
    )(); */
