const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\.tsx?$": ["ts-jest", {}],
  },
  testMatch: ["**/?(*.)+(test).ts"],
  setupFilesAfterEnv: ["<rootDir>/src/shared/test/setup.ts"],
};
