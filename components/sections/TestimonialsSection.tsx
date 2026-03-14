"use client";
import { useRef, useEffect } from "react";
import { useLang } from "@/lib/context/LangContext";
import { TESTIMONIALS } from "@/lib/constants";

export default function TestimonialsSection() {
  const { T } = useLang();

  return (
    <section id="testimonials" className="py-24 overflow-hidden" style={{ background: "#0b0b0f" }}>
      <div className="max-w-7xl mx-auto px-[5%]">
        <RevealDiv className="text-center mb-16">
          <p className="text-yellow-400 text-[10px] tracking-[5px] uppercase font-semibold mb-3">{T("testi_eyebrow")}</p>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white">{T("testi_title")}</h2>
        </RevealDiv>
      </div>
      <div className="overflow-hidden">
        <div className="testimonials-scroll flex gap-6" style={{ width: "max-content" }}>
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div key={i} className="min-w-[320px] max-w-[340px] glass-card rounded-2xl p-7 border border-yellow-400/10 hover:border-yellow-400/30 transition-colors flex-shrink-0">
              <div className="text-yellow-400 text-sm mb-4">{"★".repeat(t.stars)}</div>
              <p className="font-playfair italic text-white/90 text-sm leading-7 mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-black font-cinzel text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-yellow-400 text-xs tracking-wide">{t.event}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RevealDiv({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { ref.current?.classList.add("visible"); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className || ""}`}>{children}</div>;
}
