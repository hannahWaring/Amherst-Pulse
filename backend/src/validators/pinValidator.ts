// create rules and update rules are the same for now, change if needed
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

// Amherst approximate bounding box
const MIN_LATITUDE = 42.30;
const MAX_LATITUDE = 42.45;
const MIN_LONGITUDE = -72.60;
const MAX_LONGITUDE = -72.45;

const validTitle: Rule<UpdatePinInput> = (input) =>
  input.title !== undefined &&
  (typeof input.title !== "string" || input.title.trim().length === 0)
    ? "title cannot be empty."
    : null;

const validLatitude: Rule<UpdatePinInput> = (input) =>
  input.latitude != null &&
  (input.latitude < MIN_LATITUDE || input.latitude > MAX_LATITUDE)
    ? "latitude must be within Amherst."
    : null;

const validLongitude: Rule<UpdatePinInput> = (input) =>
  input.longitude != null &&
  (input.longitude < MIN_LONGITUDE || input.longitude > MAX_LONGITUDE)
    ? "longitude must be within Amherst."
    : null;

const validStartsAt: Rule<UpdatePinInput> = (input) =>
  input.starts_at != null && Number.isNaN(Date.parse(input.starts_at))
    ? "starts_at must be a valid date."
    : null;

const validEndsAt: Rule<UpdatePinInput> = (input) =>
  input.ends_at != null && Number.isNaN(Date.parse(input.ends_at))
    ? "ends_at must be a valid date."
    : null;

const endsAfterStarts: Rule<UpdatePinInput> = (input) =>
  input.starts_at != null &&
  input.ends_at != null &&
  Date.parse(input.ends_at) <= Date.parse(input.starts_at)
    ? "ends_at must be after starts_at."
    : null;


const createRules: Rule<CreatePinInput>[] = [
  // add rules for creating a pin here
  validTitle,
  validLatitude,
  validLongitude,
  validStartsAt,
  validEndsAt,
  endsAfterStarts,

];

const updateRules: Rule<UpdatePinInput>[] = [
  // add rules for updating a pin here
  validTitle,
  validLatitude,
  validLongitude,
  validStartsAt,
  validEndsAt,
  endsAfterStarts,
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
