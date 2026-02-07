/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFiles: ["<rootDir>/src/test/setupEnv.cjs"],

  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },

  // Because your source imports use ".js" specifiers in TS files
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};