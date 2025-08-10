export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
// postJSON зараз буде ходити в наші внутрішні шляхи:
export async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
