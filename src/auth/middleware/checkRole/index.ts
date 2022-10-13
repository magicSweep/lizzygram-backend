import { exists } from "../../service/UserDb/UserDb.fake";
import * as sessionStorage from "../../service/session";
import { checkRoleMiddleware as checkRoleMiddleware_ } from "./checkRole";

const checkRoleMiddleware = checkRoleMiddleware_(exists, sessionStorage);

export default checkRoleMiddleware;
