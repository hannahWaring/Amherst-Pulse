import { badRequest } from "../errors/AppError.js";

// A rule returns an error message if the input breaks it, or null if it passes.
type Input = Record<string, unknown>;
type Rule = (input: Input) => string | null;

const ROLES = ["collaborator", "viewer"];

const roleRequired: Rule = (input) =>
  typeof input.role === "string" && ROLES.includes(input.role)
    ? null
    : `role is required and must be one of: ${ROLES.join(", ")}.`;

const usernameRequired: Rule = (input) =>
  typeof input.username === "string" && input.username.trim().length > 0
    ? null
    : "username is required.";

// Rejects fields that are not in `allowed`.
function onlyFields(allowed: string[]): Rule {
  return (input) => {
    const unknown = Object.keys(input).filter((key) => !allowed.includes(key));
    return unknown.length > 0
      ? `Unknown field(s): ${unknown.join(", ")}.`
      : null;
  };
}

const addRules: Rule[] = [
  onlyFields(["username", "role"]),
  usernameRequired,
  roleRequired,
];

const updateRoleRules: Rule[] = [onlyFields(["role"]), roleRequired];

// Runs every rule and throws one 400 listing all failures in `details`.
function runRules(rules: Rule[], input: Input): void {
  const errors = rules
    .map((rule) => rule(input))
    .filter((message): message is string => message !== null);
  if (errors.length > 0) {
    throw badRequest("Invalid member input.", errors);
  }
}

export function validateAddMember(input: Input): void {
  runRules(addRules, input);
}

export function validateUpdateMemberRole(input: Input): void {
  runRules(updateRoleRules, input);
}
