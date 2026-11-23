// Generates docs/api.md (repo root) from the swagger-jsdoc spec.
// Run with `npm run docs:generate` in backend/; also run by the pre-commit hook.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { convertMarkdown } from "openapi-to-md";
import { swaggerSpec } from "../src/config/swagger.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const outFile = path.join(repoRoot, "docs", "api.md");

// convertMarkdown takes the spec's contents (JSON or YAML text).
const markdown = await convertMarkdown(JSON.stringify(swaggerSpec));
if (!markdown) {
  throw new Error("openapi-to-md could not read the generated spec");
}
mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(outFile, markdown);
console.log(`Wrote ${path.relative(repoRoot, outFile)}`);
