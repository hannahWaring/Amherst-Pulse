import { badRequest } from "../errors/AppError.js";

// A rule returns an error message if the input breaks it, or null if it passes.
type Input = Record<string, unknown>;
type Rule = (input: Input) => string | null;

const TITLE_MIN = 3;
const TITLE_MAX = 200;
const VISIBILITIES = ["private", "public"];
// The only fields a client may send (id and owner_id are set by the backend).
const ALLOWED_FIELDS = ["title", "description", "visibility"];

const noUnknownFields: Rule = (input) => {
  const unknown = Object.keys(input).filter(
    (key) => !ALLOWED_FIELDS.includes(key),
  );
  return unknown.length > 0
    ? `Unknown field(s): ${unknown.join(", ")}.`
    : null;
};

// Checks the title only if it was sent (used on update).
const titleValid: Rule = (input) => {
  if (input.title === undefined) return null;
  if (typeof input.title !== "string") return "title must be a string.";
  const length = input.title.trim().length;
  return length < TITLE_MIN || length > TITLE_MAX
    ? `title must be ${TITLE_MIN}-${TITLE_MAX} characters.`
    : null;
};

const visibilityValid: Rule = (input) =>
  input.visibility === undefined ||
  (typeof input.visibility === "string" &&
    VISIBILITIES.includes(input.visibility))
    ? null
    : `visibility must be one of: ${VISIBILITIES.join(", ")}.`;

const descriptionValid: Rule = (input) =>
  input.description === undefined ||
  input.description === null ||
  typeof input.description === "string"
    ? null
    : "description must be a string or null.";

const titleRequired: Rule = (input) =>
  input.title === undefined ? "title is required." : null;

const visibilityRequired: Rule = (input) =>
  input.visibility === undefined ? "visibility is required." : null;

const createRules: Rule[] = [
  noUnknownFields,
  titleRequired,
  titleValid,
  visibilityRequired,
  visibilityValid,
  descriptionValid,
];

const updateRules: Rule[] = [
  noUnknownFields,
  titleValid,
  visibilityValid,
  descriptionValid,
];

// Runs every rule and throws one 400 listing all failures in `details`.
function runRules(rules: Rule[], input: Input): void {
  const errors = rules
    .map((rule) => rule(input))
    .filter((message): message is string => message !== null);
  if (errors.length > 0) {
    throw badRequest("Invalid collection input.", errors);
  }
}

export function validateCreateCollection(input: Input): void {
  runRules(createRules, input);
}

export function validateUpdateCollection(input: Input): void {
  runRules(updateRules, input);
}
