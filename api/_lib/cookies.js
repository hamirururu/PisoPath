// Minimal cookie helpers (replaces the `cookie` package).
export function parse(header = "") {
  const out = {};
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const name = part.slice(0, i).trim();
    if (!name || name in out) continue;
    let value = part.slice(i + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    try {
      out[name] = decodeURIComponent(value);
    } catch {
      out[name] = value;
    }
  }
  return out;
}

export function serialize(name, value, opts = {}) {
  let s = `${name}=${encodeURIComponent(value)}`;
  if (opts.maxAge != null) s += `; Max-Age=${Math.floor(opts.maxAge)}`;
  if (opts.path) s += `; Path=${opts.path}`;
  if (opts.httpOnly) s += "; HttpOnly";
  if (opts.secure) s += "; Secure";
  if (opts.sameSite) {
    const v = String(opts.sameSite).toLowerCase();
    s += `; SameSite=${v === "strict" ? "Strict" : v === "none" ? "None" : "Lax"}`;
  }
  return s;
}