const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || '';

export async function apiFetch(path, options = {}) {
  if (!API_BASE) {
    throw new Error('API_BASE is not configured. Check NEXT_PUBLIC_API_BASE_URL environment variable.');
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.msg || `Request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}
