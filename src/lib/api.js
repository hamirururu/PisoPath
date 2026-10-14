export class ApiError extends Error {
  constructor(message, { status, code, retryAfter } = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

async function request(method, path, body) {
  const res = await fetch(path, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(method !== "GET" && { "Content-Type": "application/json", "X-PisoPath-CSRF": "1" }),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }

  if (!res.ok) {
    if (res.status === 401 && !path.startsWith("/api/auth/login")) {
      window.dispatchEvent(new Event("pisopath:unauthorized"));
    }
    throw new ApiError(data?.error || "Something went wrong.", {
      status: res.status, code: data?.code, retryAfter: data?.retryAfter,
    });
  }
  return data;
}

export const qs = (obj) => {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => v != null && p.set(k, String(v)));
  return `?${p}`;
};

export const api = {
  get: (p) => request("GET", p),
  post: (p, b = {}) => request("POST", p, b),
  patch: (p, b = {}) => request("PATCH", p, b),
  del: (p) => request("DELETE", p, {}),
};

export const refreshUser = () => window.dispatchEvent(new Event("pisopath:refresh-user"));