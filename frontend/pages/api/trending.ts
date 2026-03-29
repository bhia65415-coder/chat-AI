import type { NextApiRequest, NextApiResponse } from "next";

function apiBase(): string {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000"
  ).replace(/\/$/, "");
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const r = await fetch(`${apiBase()}/trending`, { method: "GET" });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch {
    return res.status(502).json({
      headline: "Stay alert: verify UPI payee; never share OTP on calls; cyber helpline 1930.",
      precaution_en: "If pressured to pay urgently, pause and verify in your official bank app.",
      precaution_hi: "जल्दबाज़ी में पेमेंट न करें; आधिकारिक ऐप में जाँच करें।",
    });
  }
}
