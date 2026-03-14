"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/context/LangContext";
import type { GalleryItem } from "@/types";
import { DEFAULT_GALLERY } from "@/lib/constants";

export default function GalleryPreview({ items }: { items?: GalleryItem[] }) {
  const { T } = useLang();
  const data = (items?.length ? items : DEFAULT_GALLERY.map((g, i) => ({ ...g, id: String(i), created_at: "" }))).slice(0, 8);

  return (
    <section id="gallery-preview" className="py-24 px-[5%]" style={{ background: "#0A0A0A" }}>
      <div className="max-w-7xl mx-auto">
        <RevealDiv className="text-center mb-12">
          <p className="text-yellow-400 text-[10px] tracking-[5px] uppercase font-semibold mb-3">{T("gallery_eyebrow")}</p>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white">{T("gallery_title")}</h2>
        </RevealDiv>
        <RevealDiv className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.map((item, i) => (
            <div key={item.id} className={`relative overflow-hidden rounded-xl cursor-pointer group ${i === 0 || i === 5 ? "row-span-2" : ""} ${i === 3 ? "col-span-2" : ""}`}
              style={{ minHeight: 200 }}>
              <Image src={item.image_url} alt={item.caption || ""} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="25vw" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                style={{ background: "linear-gradient(to top,rgba(0,0,0,0.85),transparent)" }}>
                <span className="text-white text-xs font-semibold tracking-widest uppercase">{item.caption}</span>
              </div>
            </div>
          ))}
        </RevealDiv>
        <RevealDiv className="text-center mt-10">
          <Link href="/gallery" className="border border-yellow-400/30 text-yellow-400 px-10 py-3.5 rounded-full text-xs font-bold tracking-[3px] uppercase hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all">
            View Full Portfolio →
          </Link>
        </RevealDiv>
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
