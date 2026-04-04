export type ScamAlert = {
  id: number;
  title: string;
  description: string;
  scam_type: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  affected_states: string;
  source_url: string;
  source_name: string;
  fetched_at: string;
};

export type ChatResponse = {
  language: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  scam_type: string;
  answer: string;
  action_plan: string[];
  official_links: { label: string; url: string }[];
  whatsapp_ready_text: string;
  _meta?: Record<string, unknown>;
};

// In a real Angular app we might use environment.ts, but standard process.env mapping or hardcoded fallback is fine.
const BASE_URL = "https://chat-ai-6-aqwp.onrender.com";

async function http<T>(
  path: string,
  opts: RequestInit & { token?: string } = {}
): Promise<T> {
  const headers = new Headers(opts.headers);
  headers.set("Content-Type", "application/json");
  if (opts.token) headers.set("Authorization", `Bearer ${opts.token}`);

  // cache: 'no-store' maps to standard dynamic fetching without caching
  const res = await fetch(`${BASE_URL}${path}`, { ...opts, headers, cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export const api = {
  trendingScams: () => http<{ items: ScamAlert[] }>("/api/scams/trending"),
  scamsByState: (state: string) =>
    http<{ items: ScamAlert[] }>(`/api/scams/by-state?state=${encodeURIComponent(state)}`),
  chat: (payload: { message: string; language_code: string; session_id?: string }, token?: string) =>
    http<ChatResponse>("/api/chat", { method: "POST", body: JSON.stringify(payload), token }),
  sendWhatsApp: (payload: { to: string; text: string; language_code: string }, token?: string) =>
    http<{ ok: true; sid?: string }>("/api/whatsapp/send", {
      method: "POST",
      body: JSON.stringify(payload),
      token,
    }),
};
