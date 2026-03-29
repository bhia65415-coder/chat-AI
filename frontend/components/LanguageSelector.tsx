const langs = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "mr", label: "मराठी" },
];

export default function LanguageSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {langs.map((l) => {
        const active = value === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => onChange(l.code)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              active
                ? "bg-sky text-ink"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
