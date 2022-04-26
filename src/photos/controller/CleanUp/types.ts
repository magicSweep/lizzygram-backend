import { Logger } from "winston";
import { MainData } from "../../middleware/Main/types";

export type CleanUp = (logger: Logger) => (data: MainData) => void;

export type FullCleanUp = (logger: Logger) => (data: MainData) => void;

export type StoragesCleanUp = (logger: Logger) => (data: MainData) => void;
