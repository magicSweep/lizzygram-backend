import { checkRoleMiddleware as checkRoleMiddleware_ } from "./checkRole";

const userExists = jest.fn(() => Promise.resolve(true));

const req = {
  user: {
    uid: "helloUid",
  },
};

const end = jest.fn();

const res = {
  status: () => ({
    end,
  }),
};
const next = jest.fn();

const logger = {
  log: jest.fn(),
};

describe("checkRoleMiddleware", () => {
  const checkRoleMiddleware = checkRoleMiddleware_(userExists)(logger as any);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("If all okey", async () => {
    await checkRoleMiddleware(
      { user: { ...req.user } } as any,
      res as any,
      next as any
    );

    expect(userExists).toHaveBeenCalledTimes(1);
    expect(userExists).toHaveBeenNthCalledWith(1, "helloUid");

    expect(next).toHaveBeenCalledTimes(1);

    expect(end).toHaveBeenCalledTimes(0);

    expect(logger.log).toHaveBeenNthCalledWith(1, "info", "USER IS EDITOR");
  });

  test("User not editor", async () => {
    userExists.mockResolvedValueOnce(false);

    await checkRoleMiddleware(
      { user: { ...req.user } } as any,
      res as any,
      next as any
    );

    expect(userExists).toHaveBeenCalledTimes(1);
    expect(userExists).toHaveBeenNthCalledWith(1, "helloUid");

    expect(next).toHaveBeenCalledTimes(0);

    expect(end).toHaveBeenCalledTimes(1);

    expect(logger.log).toHaveBeenNthCalledWith(1, "info", "USER NOT EDITOR");
  });

  test("Error on user db request", async () => {
    userExists.mockRejectedValueOnce("Bad fat error...");

    await checkRoleMiddleware(
      { user: { ...req.user } } as any,
      res as any,
      next as any
    );

    expect(userExists).toHaveBeenCalledTimes(1);
    expect(userExists).toHaveBeenNthCalledWith(1, "helloUid");

    expect(next).toHaveBeenCalledTimes(0);

    expect(end).toHaveBeenCalledTimes(1);

    expect(logger.log).toHaveBeenNthCalledWith(1, "error", "CHECK ROLE ERROR", {
      ERROR: "Bad fat error...",
      METHOD: undefined,
      PATH: undefined,
      USER: { uid: "helloUid" },
    });
  });
});
