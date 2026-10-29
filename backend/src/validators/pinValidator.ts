import { badRequest } from "../errors/AppError.js";
import type { CreatePinInput, UpdatePinInput } from "../types/pins.js";

// TODO: validation rules still need to be decided and added to the lists below.
// Until then every input passes, and bad values only get caught by the
// database (sent as generic 400s by the error handler). Candidates so far:
//   - ends_at must be after starts_at
//   - latitude / longitude must be numbers in range
//   - reject (or drop) fields that are not pin columns

// A rule returns an error message if the input breaks it, or null if it passes.
type Rule<T> = (input: T) => string | null;

// Rules typed on UpdatePinInput (all fields optional) can be used in both lists.
// Example:
// const endsAfterStarts: Rule<UpdatePinInput> = (input) =>
//   input.starts_at && input.ends_at && input.ends_at <= input.starts_at
//     ? "ends_at must be after starts_at."
//     : null;

const createRules: Rule<CreatePinInput>[] = [
  // add rules for creating a pin here
];

const updateRules: Rule<UpdatePinInput>[] = [
  // add rules for updating a pin here
];

// Runs every rule and throws one 400 listing all failures in `details`.
function runRules<T>(rules: Rule<T>[], input: T): void {
  const errors = rules
    .map((rule) => rule(input))
    .filter((message): message is string => message !== null);
  if (errors.length > 0) {
    throw badRequest("Invalid pin input.", errors);
  }
}

export function validateCreatePin(input: CreatePinInput): void {
  runRules(createRules, input);
}

export function validateUpdatePin(input: UpdatePinInput): void {
  runRules(updateRules, input);
}
