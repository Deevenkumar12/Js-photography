"use client";
import { useLang } from "@/lib/context/LangContext";

export default function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      className="flex rounded-full overflow-hidden border border-yellow-400/20"
      style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}
    >
      {(["en", "te"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 text-xs font-bold tracking-widest uppercase transition-all ${
            lang === l
              ? "bg-yellow-400 text-black"
              : "text-gray-500 hover:text-yellow-400"
          }`}
        >
          {l === "en" ? "EN" : "తె"}
        </button>
      ))}
    </div>
  );
}
