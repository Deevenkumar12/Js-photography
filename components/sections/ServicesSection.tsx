"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { useLang } from "@/lib/context/LangContext";
import type { Service } from "@/types";
import { DEFAULT_SERVICES } from "@/lib/constants";

export default function ServicesSection({ services }: { services?: Service[] }) {
  const { T, lang } = useLang();
  const data: Service[] = services?.length
    ? services
    : DEFAULT_SERVICES.map((s, i) => ({ ...s, id: String(i), created_at: "" } as Service));

  return (
    <section
      id="services"
      className="py-24 px-[5%]"
      style={{ background: "linear-gradient(180deg,#0A0A0A 0%,#0b0b0f 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <Reveal className="mb-14">
          <p className="text-yellow-400 text-[10px] tracking-[5px] uppercase font-semibold mb-3">
            {T("services_eyebrow")}
          </p>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {T("services_title")}
          </h2>
          <p className="text-gray-500 text-base leading-7 max-w-xl">{T("services_desc")}</p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((s, i) => (
            <Reveal key={s.id} style={{ transitionDelay: `${i * 0.07}s` }}>
              <a
                href="/#booking"
                className="group relative rounded-2xl overflow-hidden block border border-yellow-400/10 transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(255,215,0,0.1)]"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={s.image_url}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top,rgba(10,10,10,0.95) 30%,transparent 70%)" }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(to top,rgba(10,10,10,0.98) 40%,rgba(0,0,0,0.3) 100%)" }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl border border-yellow-400/20"
                    style={{ background: "rgba(255,215,0,0.08)" }}
                  >
                    {s.icon}
                  </div>
                  <h3 className="font-cinzel text-base font-bold text-white mb-2 tracking-wide">
                    {lang === "te" ? (s.title_te ?? s.title) : s.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500">
                    {lang === "te" ? (s.description_te ?? s.description) : s.description}
                  </p>
                  <p className="text-yellow-400 text-xs font-semibold tracking-wider mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {s.price}
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reveal({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { ref.current?.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className ?? ""}`} style={style}>{children}</div>;
}
