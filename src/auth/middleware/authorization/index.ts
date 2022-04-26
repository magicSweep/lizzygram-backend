import { getAuthUser } from "../../service/Auth/Auth.fake";
import { authorization_ } from "./authorization";

const authorization = authorization_(getAuthUser);

export default authorization;
