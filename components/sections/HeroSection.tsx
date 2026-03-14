"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/context/LangContext";
import { HERO_IMAGES } from "@/lib/constants";

export default function HeroSection({
  heroImages,
}: {
  heroImages?: string[];
}) {
  const { T } = useLang();
  const images = heroImages?.length ? heroImages : HERO_IMAGES;
  const [current, setCurrent] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const particlesRef = useRef<HTMLDivElement>(null);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((c) => (c + 1) % images.length),
      5000
    );
    return () => clearInterval(interval);
  }, [images.length]);

  // Parallax mouse
  useEffect(() => {
    const onMove = (e: MouseEvent) =>
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 12,
        y: (e.clientY / window.innerHeight - 0.5) * 12,
      });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Particles
  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 24; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = 1 + Math.random() * 2;
      p.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;--dur:${4 + Math.random() * 8}s;--delay:${Math.random() * 7}s`;
      container.appendChild(p);
    }
  }, []);

  const stats = [
    { val: 500, suffix: "+", key: "stat1" },
    { val: 300, suffix: "+", key: "stat2" },
    { val: 12,  suffix: "",  key: "stat3" },
    { val: 100, suffix: "%", key: "stat4" },
  ];

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: "100vh", minHeight: 600 }}
    >
      {/* Background slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <Image
              src={images[current]}
              alt="JS Photography"
              fill
              className="object-cover ken-burns"
              priority
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(135deg,rgba(10,10,10,0.78) 0%,rgba(10,10,15,0.5) 50%,rgba(10,10,10,0.85) 100%)",
        }}
      />
      {/* Gold radial */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%,rgba(255,215,0,0.06) 0%,transparent 60%)",
        }}
      />

      {/* Particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 z-[2] pointer-events-none"
      />

      {/* Lens rings (desktop) */}
      {[
        { size: 300, top: "10%", right: "8%",  cls: "lens-ring-1", opacity: 0.10, border: 1 },
        { size: 200, top: "15%", right: "13%", cls: "lens-ring-2", opacity: 0.06, border: 2 },
        { size: 80,  top: "30%", right: "21%", cls: "lens-ring-3", opacity: 0.15, border: 1 },
      ].map((ring, i) => (
        <div
          key={i}
          className={`${ring.cls} absolute rounded-full hidden md:block z-[2]`}
          style={{
            width:  ring.size,
            height: ring.size,
            top:    ring.top,
            right:  ring.right,
            border: `${ring.border}px solid rgba(255,215,0,${ring.opacity})`,
            transform: `translate(${mousePos.x * (i + 1) * 0.3}px, ${mousePos.y * (i + 1) * 0.3}px)`,
            transition: "transform 0.3s ease",
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-[3] text-center px-5 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-yellow-400 text-xs tracking-[5px] uppercase font-semibold mb-5 opacity-80"
        >
          {T("hero_eyebrow")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-cinzel font-black leading-none mb-4"
          style={{ fontSize: "clamp(3rem,10vw,7rem)" }}
        >
          <span className="text-gold-glow">JS</span>
          <br />
          <span className="text-white">PHOTOGRAPHY</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-playfair italic text-gray-400 mb-10"
          style={{ fontSize: "clamp(1rem,2.5vw,1.4rem)" }}
        >
          {T("hero_sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Link
            href="/#booking"
            className="bg-yellow-400 text-black px-9 py-3.5 rounded-full font-bold text-xs tracking-[2px] uppercase hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] transition-all"
          >
            {T("hero_btn1")}
          </Link>
          <Link
            href="/gallery"
            className="border border-white/30 text-white px-9 py-3.5 rounded-full font-semibold text-xs tracking-[2px] uppercase hover:border-yellow-400 hover:text-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all"
          >
            {T("hero_btn2")}
          </Link>
        </motion.div>
      </div>

      {/* Stats bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[3] flex gap-6 md:gap-12"
      >
        {stats.map((s) => (
          <HeroCounter key={s.key} val={s.val} suffix={s.suffix} label={T(s.key)} />
        ))}
      </motion.div>

      {/* Slide dots */}
      <div className="absolute bottom-10 right-10 z-[3] flex flex-col gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1 rounded-full transition-all ${
              i === current ? "h-8 bg-yellow-400" : "h-2 bg-yellow-400/30"
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="scroll-bounce absolute bottom-10 left-10 z-[3] hidden md:flex flex-col items-center gap-2">
        <span className="text-[9px] tracking-[3px] uppercase text-yellow-400 opacity-60">Scroll</span>
        <div
          className="w-px h-10"
          style={{ background: "linear-gradient(to bottom,#FFD700,transparent)" }}
        />
      </div>
    </section>
  );
}

function HeroCounter({
  val,
  suffix,
  label,
}: {
  val: number;
  suffix: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let c = 0;
        const step = Math.ceil(val / 80);
        const timer = setInterval(() => {
          c = Math.min(c + step, val);
          setCount(c);
          if (c >= val) clearInterval(timer);
        }, 20);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [val]);

  return (
    <div ref={ref} className="text-center">
      <span className="font-cinzel text-2xl md:text-4xl font-black text-yellow-400 block">
        {count}{suffix}
      </span>
      <span className="text-[10px] tracking-[3px] uppercase text-gray-500 mt-1 block">
        {label}
      </span>
    </div>
  );
}
