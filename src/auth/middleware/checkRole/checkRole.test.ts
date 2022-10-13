import { checkRoleMiddleware as checkRoleMiddleware_ } from "./checkRole";

const userExists = jest.fn(() => Promise.resolve(true));

const req = {
  user: {
    uid: "helloUid",
  },
};

const end = jest.fn();

const res = {
  status: jest.fn(() => ({
    end,
  })),
};
const next = jest.fn();

const logger = {
  log: jest.fn(),
};

/* type SessionStorage = {
  getRole: (props: { userUid: string }) => Promise<boolean | null>;
  saveRole: (props: { userUid: string; isEditor: boolean }) => Promise<void>;
}; */

const getRole_ = jest.fn();
const saveRole_ = jest.fn();

const sessionStorage = {
  getRole: () => getRole_,
  saveRole: () => saveRole_,
};

describe("checkRoleMiddleware", () => {
  const checkRoleMiddleware = checkRoleMiddleware_(
    userExists,
    sessionStorage
  )(logger as any);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("First we check if we have saved role for current user. If yes - we only return add it to user.", async () => {
    getRole_.mockResolvedValueOnce(true);

    let iReq: any = { user: { ...req.user } };

    await checkRoleMiddleware(iReq, res as any, next as any);

    expect(getRole_).toHaveBeenCalledTimes(1);
    expect(getRole_).toHaveBeenNthCalledWith(1, {
      userUid: "helloUid",
    });

    expect(userExists).toHaveBeenCalledTimes(0);
    //expect(userExists).toHaveBeenNthCalledWith(1, "helloUid");

    expect(saveRole_).toHaveBeenCalledTimes(0);

    expect(next).toHaveBeenCalledTimes(1);

    expect(end).toHaveBeenCalledTimes(0);

    expect(logger.log).toHaveBeenNthCalledWith(1, "info", "USER IS EDITOR");
  });

  test("If we do not have saved to session user - we send request to db to get role.", async () => {
    getRole_.mockResolvedValueOnce(null);

    userExists.mockResolvedValueOnce(true);

    await checkRoleMiddleware(
      { user: { ...req.user } } as any,
      res as any,
      next as any
    );

    expect(getRole_).toHaveBeenCalledTimes(1);
    expect(getRole_).toHaveBeenNthCalledWith(1, {
      userUid: "helloUid",
    });

    expect(userExists).toHaveBeenCalledTimes(1);
    expect(userExists).toHaveBeenNthCalledWith(1, "helloUid");

    expect(next).toHaveBeenCalledTimes(1);

    expect(end).toHaveBeenCalledTimes(0);

    expect(logger.log).toHaveBeenNthCalledWith(1, "info", "USER IS EDITOR");
  });

  test("If user not editor - we return 403 status", async () => {
    getRole_.mockResolvedValueOnce(null);

    userExists.mockResolvedValueOnce(false);

    await checkRoleMiddleware(
      { user: { ...req.user } } as any,
      res as any,
      next as any
    );

    expect(getRole_).toHaveBeenCalledTimes(1);
    expect(getRole_).toHaveBeenNthCalledWith(1, {
      userUid: "helloUid",
    });

    expect(userExists).toHaveBeenCalledTimes(1);
    expect(userExists).toHaveBeenNthCalledWith(1, "helloUid");

    expect(next).toHaveBeenCalledTimes(0);

    expect(end).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenNthCalledWith(1, 403);

    expect(logger.log).toHaveBeenNthCalledWith(1, "info", "USER NOT EDITOR");
  });

  test("Error on user db request - we return 500 status", async () => {
    getRole_.mockResolvedValueOnce(null);

    userExists.mockRejectedValueOnce("Bad fat error...");

    await checkRoleMiddleware(
      { user: { ...req.user } } as any,
      res as any,
      next as any
    );

    expect(getRole_).toHaveBeenCalledTimes(1);
    expect(getRole_).toHaveBeenNthCalledWith(1, {
      userUid: "helloUid",
    });

    expect(userExists).toHaveBeenCalledTimes(1);
    expect(userExists).toHaveBeenNthCalledWith(1, "helloUid");

    expect(next).toHaveBeenCalledTimes(0);

    expect(end).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenNthCalledWith(1, 500);

    expect(logger.log).toHaveBeenNthCalledWith(1, "error", "CHECK ROLE ERROR", {
      ERROR: "Bad fat error...",
      METHOD: undefined,
      PATH: undefined,
      USER: { uid: "helloUid" },
    });
  });
});
