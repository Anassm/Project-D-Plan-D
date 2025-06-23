const { createDefaultPreset } = require("ts-jest");

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  preset: 'ts-jest',
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    ...tsJestTransformCfg,
  },
};