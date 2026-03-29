/**
 * Static help: example topics, cyber helpline, legal disclaimer (not part of chat bubbles).
 */
export default function HelpInfoBox({
  lang,
  disclaimerHi,
  disclaimerEn,
}: {
  lang: string;
  disclaimerHi?: string;
  disclaimerEn?: string;
}) {
  const hi = lang === "hi";
  const title = hi ? "मदद — उदाहरण व जरूरी जानकारी" : "Help — examples & important info";
  const examplesTitle = hi ? "आप ऐसे पूछ सकते हैं" : "You can ask about";
  const examples = hi
    ? [
        "अज्ञात UPI डेबिट",
        "नकली KYC कॉल",
        "लोन ऐप परेशानी",
        "नकली निवेश / टिप",
      ]
    : [
        "Unknown UPI debit",
        "Fake KYC call",
        "Loan app harassment",
        "Fake investment tip",
      ];
  const emergency = hi
    ? "साइबर रिपोर्टिंग: हेल्पलाइन 1930 व "
    : "Cyber reporting: helpline 1930 & ";

  const dh =
    disclaimerHi ||
    "यह AI केवल जानकारी के लिए है। कानूनी सलाह के लिए योग्य वकील से संपर्क करें।";
  const de =
    disclaimerEn ||
    "This AI is for information only. Consult a qualified lawyer for legal advice.";

  return (
    <aside
      className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-4 text-sm text-slate-300"
      aria-label="Help and disclaimer"
    >
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</h2>
      <p className="mt-3 text-xs font-medium text-slate-400">{examplesTitle}</p>
      <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-slate-300">
        {examples.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed">
        <span className="font-semibold text-amber-200/90">{emergency}</span>
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noreferrer"
          className="text-sky underline hover:text-sky/90"
        >
          cybercrime.gov.in
        </a>
      </p>
      <div className="mt-4 border-t border-slate-700 pt-4 text-[11px] leading-relaxed text-slate-500">
        <p className="italic text-slate-400">{dh}</p>
        <p className="mt-2 italic">({de})</p>
      </div>
    </aside>
  );
}
