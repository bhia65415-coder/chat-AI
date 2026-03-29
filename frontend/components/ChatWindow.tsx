import ReactMarkdown from "react-markdown";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWindow({
  messages,
  loading,
}: {
  messages: ChatMessage[];
  loading: boolean;
}) {
  return (
    <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      {messages.length === 0 ? (
        <p className="text-sm text-slate-400">
          Ask about UPI fraud, KYC calls, loan apps, SEBI registration checks, or where to
          complain (1930 / cybercrime.gov.in).
        </p>
      ) : null}
      {messages.map((m, i) => (
        <div
          key={i}
          className={`max-w-[95%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            m.role === "user"
              ? "ml-auto bg-sky/20 text-slate-50"
              : "mr-auto border border-slate-800 bg-slate-900/70 text-slate-100"
          }`}
        >
          {m.role === "assistant" ? (
            <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-li:my-0">
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{m.content}</p>
          )}
        </div>
      ))}
      {loading ? (
        <p className="text-xs text-slate-500">Thinking with safety checks…</p>
      ) : null}
    </div>
  );
}
