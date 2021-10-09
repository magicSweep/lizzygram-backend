//import type { Config } from "@jest/types";

const config /* : Config.InitialOptions */ = {
  //verbose: true,

  testEnvironment: "jest-environment-node",

  /*  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/node_modules/identity-obj-proxy",
    "^.+\\.module\\.(css|sass|scss)$":
      "<rootDir>/node_modules/identity-obj-proxy",
  }, */

  roots: ["<rootDir>/src"],

  //testMatch: ["<rootDir>/src/**/*.test.(js|jsx|ts|tsx)$)"],

  transform: {
    "^.+\\.[t|j]s?$": "ts-jest",
    //"^.+\\.[t|j]sx?$": "ts-jest",
    //"^.+\\.tsx?$": "<rootDir>/node_modules/ts-jest",
    //"^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/jest/fileTransform.js",
  },

  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
    "^.+\\.module\\.(css|sass|scss)$",
  ],

  setupFiles: ["dotenv/config"],
};
export default config;
