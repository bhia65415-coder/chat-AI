import { useEffect, useState } from "react";

type Trending = {
  headline?: string;
  precaution_en?: string;
  precaution_hi?: string;
};

const copy = {
  en: { title: "Trending scam alert", tip: "Precaution" },
  hi: { title: "आज का ट्रेंडिंग अलर्ट", tip: "सावधानी" },
};

export default function FraudAlert({ lang }: { lang: string }) {
  const [data, setData] = useState<Trending | null>(null);
  const l = lang === "hi" ? "hi" : "en";
  const t = copy[l];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/trending");
        const j = await r.json();
        if (!cancelled) setData(j);
      } catch {
        if (!cancelled) setData({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const headline = data?.headline || "Loading safety headline…";
  const tip =
    l === "hi"
      ? data?.precaution_hi || data?.precaution_en || ""
      : data?.precaution_en || data?.precaution_hi || "";

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 shadow-lg shadow-black/30">
      <div className="flex items-start gap-3">
        <div className="text-2xl" aria-hidden>
          ⚠️
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-200/90">
            {t.title}
          </p>
          <p className="mt-1 text-sm text-slate-100">{headline}</p>
          {tip ? (
            <p className="mt-2 text-xs text-slate-200/90">
              <span className="font-semibold text-mint">{t.tip}: </span>
              {tip}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
