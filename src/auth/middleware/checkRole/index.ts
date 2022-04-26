import { exists } from "../../service/UserDb/UserDb.fake";
import { checkRoleMiddleware as checkRoleMiddleware_ } from "./checkRole";

const checkRoleMiddleware = checkRoleMiddleware_(exists);

export default checkRoleMiddleware;
