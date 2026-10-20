/** @type {import('jest').Config} */
export default {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  // The package is ESM ("type": "module"), so run .ts files as ES modules too.
  extensionsToTreatAsEsm: [".ts"],
  // Source imports use NodeNext-style ".js" extensions; map them back to the .ts files.
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  // @swc/jest strips types only; it does not type-check.
  transform: {
    "^.+\\.ts$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript" },
          target: "es2022",
        },
        module: { type: "es6" },
      },
    ],
  },
};
