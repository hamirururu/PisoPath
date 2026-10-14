export class ValidationError extends Error {}
const fail = (m) => { throw new ValidationError(m); };

export const str = (x, name, min, max) => {
  if (typeof x !== "string") fail(`${name} is invalid.`);
  const t = x.trim();
  if (t.length < min || t.length > max) fail(`${name} is invalid.`);
  return t;
};
export const optStr = (x, name, max) => (x == null || x === "" ? null : str(x, name, 1, max));
export const money = (x, name = "Amount") => {
  const n = typeof x === "string" ? Number(x) : x;
  if (!Number.isFinite(n) || n <= 0 || n >= 1e10) fail(`${name} must be greater than zero.`);
  return Math.round(n * 100) / 100;
};
export const date = (x) => {
  if (typeof x !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(x) || Number.isNaN(Date.parse(x))) fail("Date is invalid.");
  return x;
};
export const time = (x) => {
  if (typeof x !== "string" || !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(x)) fail("Time is invalid.");
  return x;
};
export const uuid = (x) => {
  if (typeof x !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x)) fail("Invalid id.");
  return x;
};
export const oneOf = (x, list, name) => { if (!list.includes(x)) fail(`${name} is invalid.`); return x; };
export const int = (x, min, max, name) => {
  const n = Number(x);
  if (!Number.isInteger(n) || n < min || n > max) fail(`${name} is invalid.`);
  return n;
};
export const email = (x) => {
  if (typeof x !== "string" || x.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.trim())) fail("Enter a valid email address.");
  return x.trim().toLowerCase();
};
export const password = (x) => {
  if (typeof x !== "string" || x.length < 8 || x.length > 72) fail("Password must be 8 to 72 characters.");
  return x;
};