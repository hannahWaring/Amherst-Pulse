import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerJsdoc from "swagger-jsdoc";

const routesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../routes",
);

// Scans every route (endpoint) file for @openapi doc comments.
// Matches .ts under `npm run dev`/tests and the compiled .js in dist/.
export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Amherst Pulse API",
      version: "1.0.0",
      description:
        'Errors are `{ "error": { "code", "message" } }`, except collection routes, which send `{ "error": "<message>" }`.',
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  apis: [path.join(routesDir, "*Route.{ts,js}")],
});
