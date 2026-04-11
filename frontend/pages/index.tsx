import Head from "next/head";
import { useMemo, useState } from "react";
import ChatWindow, { type ChatMessage } from "@/components/ChatWindow";
import FraudAlert from "@/components/FraudAlert";
import HelpInfoBox from "@/components/HelpInfoBox";
import LanguageSelector from "@/components/LanguageSelector";

export default function Home() {
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [disclaimerHi, setDisclaimerHi] = useState<string | undefined>();
  const [disclaimerEn, setDisclaimerEn] = useState<string | undefined>();

  const greeting = useMemo(() => {
    if (lang === "hi") {
      return { hi: "नमस्ते!", help: "मैं आपकी कैसे मदद कर सकता हूँ?" };
    }
    return { hi: "Hi!", help: "How can I help you?" };
  }, [lang]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language: lang }),
      });
      const data = await r.json();
      const reply =
        typeof data.reply === "string"
          ? data.reply
          : "Sorry, I could not generate a reply. Is the backend running?";
      if (typeof data.disclaimer_hi === "string") setDisclaimerHi(data.disclaimer_hi);
      if (typeof data.disclaimer_en === "string") setDisclaimerEn(data.disclaimer_en);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      setWaDraft(reply);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Network error. Start the API: `python -m uvicorn backend.main:app --reload --port 8000` from the `fintech-ai` folder.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Fintech.ai — Financial safety (India)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-4 py-8 bg-black">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky">
            Fintech.ai
          </p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Fintech.ai</h1>
          <p className="text-lg text-white">{greeting.hi}</p>
          <p className="text-sm text-slate-400">{greeting.help}</p>
        </header>

        <FraudAlert lang={lang} />

        <HelpInfoBox lang={lang} disclaimerHi={disclaimerHi} disclaimerEn={disclaimerEn} />

        <section className="space-y-2">
          <p className="text-xs text-slate-500">Preferred response language</p>
          <LanguageSelector value={lang} onChange={setLang} />
        </section>

        <ChatWindow messages={messages} loading={loading} />

        <div className="flex gap-2">
          <input
            className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-sky"
            placeholder="Type your question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={loading}
            className="rounded-2xl bg-sky px-5 py-3 text-sm font-semibold text-ink disabled:opacity-50"
          >
            Send
          </button>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          <span>Official hubs:</span>
          <a className="text-sky hover:underline" href="https://www.sebi.gov.in" target="_blank" rel="noreferrer">
            SEBI
          </a>
          <a className="text-sky hover:underline" href="https://www.rbi.org.in" target="_blank" rel="noreferrer">
            RBI
          </a>
          <a className="text-sky hover:underline" href="https://www.irdai.gov.in" target="_blank" rel="noreferrer">
            IRDAI
          </a>
          <a className="text-sky hover:underline" href="https://www.npci.org.in" target="_blank" rel="noreferrer">
            NPCI
          </a>
          <a className="text-sky hover:underline" href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">
            Cyber Crime
          </a>
        </div>
      </main>
    </>
  );
}
