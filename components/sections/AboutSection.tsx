"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { useLang } from "@/lib/context/LangContext";

export default function AboutSection() {
  const { T } = useLang();
  const feats = [
    { icon: "📸", key: "feat1", ks: "feat1s" },
    { icon: "🚁", key: "feat2", ks: "feat2s" },
    { icon: "⚡", key: "feat3", ks: "feat3s" },
    { icon: "💎", key: "feat4", ks: "feat4s" },
  ];

  return (
    <section id="about" className="py-24 px-[5%]" style={{ background: "#0b0b0f" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image stack */}
          <RevealDiv>
            <div className="relative h-[420px] md:h-[500px]">
              <div className="absolute top-0 left-0 w-3/4 h-[85%] rounded-xl overflow-hidden border border-yellow-400/15">
                <Image src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80" alt="Wedding" fill className="object-cover" sizes="50vw" />
              </div>
              <div className="absolute bottom-0 right-0 w-1/2 h-[55%] rounded-xl overflow-hidden border-2 border-yellow-400/30 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                <Image src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80" alt="Camera" fill className="object-cover" sizes="30vw" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black font-cinzel text-xs font-bold px-4 py-3 rounded-xl text-center shadow-[0_10px_40px_rgba(255,215,0,0.3)] z-10 whitespace-nowrap">
                ✦ Since 2012<br />Rajahmundry
              </div>
            </div>
          </RevealDiv>

          {/* Text */}
          <RevealDiv className="[transition-delay:0.2s]">
            <p className="text-yellow-400 text-[10px] tracking-[5px] uppercase font-semibold mb-3">{T("about_eyebrow")}</p>
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{T("about_title")}</h2>
            <p className="text-gray-400 leading-8 mb-5 text-sm">{T("about_desc1")}</p>
            <p className="text-gray-400 leading-8 mb-8 text-sm">{T("about_desc2")}</p>
            <div className="grid grid-cols-2 gap-4">
              {feats.map(f => (
                <div key={f.key} className="flex gap-3 items-start">
                  <div className="w-9 h-9 min-w-9 rounded-lg flex items-center justify-center text-sm border border-yellow-400/20" style={{ background: "rgba(255,215,0,0.08)" }}>{f.icon}</div>
                  <div>
                    <strong className="text-white text-sm block mb-0.5 font-semibold">{T(f.key)}</strong>
                    <span className="text-gray-600 text-xs">{T(f.ks)}</span>
                  </div>
                </div>
              ))}
            </div>
          </RevealDiv>
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
