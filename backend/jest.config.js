/** @type {import('jest').Config} */
const shared = {
  testEnvironment: "node",
  // Loads .env.test (local Supabase) before any test module imports the app.
  setupFiles: ["<rootDir>/jest.setup.ts"],
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

export default {
  projects: [
    // No Docker or local Supabase needed.
    { ...shared, displayName: "unit", roots: ["<rootDir>/tests/unit"] },
    // Run against the local Supabase stack (`npx supabase start`).
    {
      ...shared,
      displayName: "integration",
      roots: ["<rootDir>/tests/integration"],
    },
  ],
};
