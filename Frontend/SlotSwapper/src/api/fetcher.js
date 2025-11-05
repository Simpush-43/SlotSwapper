export async function apiFetch(path, { method = "GET", body, token } = {}) {
  const headers = {};

  if (body) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE}${path}`, 
    { method, headers, body }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw data;
  }

  return data;
}
