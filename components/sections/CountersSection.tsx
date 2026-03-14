"use client";
import { useState, useEffect, useRef } from "react";
import { useLang } from "@/lib/context/LangContext";

export default function CountersSection() {
  const { T } = useLang();
  const items = [
    { val: 500, suffix: "+", key: "c1" },
    { val: 300, suffix: "+", key: "c2" },
    { val: 50, suffix: "+", key: "c3" },
    { val: 1200, suffix: "+", key: "c4" },
  ];
  return (
    <section id="counters" className="py-16 border-t border-b border-yellow-400/10" style={{ background: "linear-gradient(135deg,rgba(255,215,0,0.03) 0%,transparent 100%)" }}>
      <div className="max-w-7xl mx-auto px-[5%]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {items.map((item, i) => <Counter key={i} val={item.val} suffix={item.suffix} label={T(item.key)} />)}
        </div>
      </div>
    </section>
  );
}

function Counter({ val, suffix, label }: { val: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let c = 0;
        const step = Math.ceil(val / 80);
        const t = setInterval(() => { c = Math.min(c + step, val); setCount(c); if (c >= val) clearInterval(t); }, 18);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [val]);

  return (
    <div ref={ref} className="py-10">
      <span className="font-cinzel text-5xl font-black text-yellow-400 block leading-none">{count}{suffix}</span>
      <span className="text-xs tracking-[3px] uppercase text-gray-500 mt-3 block">{label}</span>
    </div>
  );
}
