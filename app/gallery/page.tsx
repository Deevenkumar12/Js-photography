"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useLang } from "@/lib/context/LangContext";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_GALLERY } from "@/lib/constants";
import type { GalleryItem } from "@/types";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const FILTERS = [
  { key: "all", label: "filter_all" },
  { key: "wedding", label: "filter_wedding" },
  { key: "prewedding", label: "filter_pre" },
  { key: "candid", label: "filter_candid" },
  { key: "drone", label: "filter_drone" },
  { key: "baby", label: "filter_baby" },
];

export default function GalleryPage() {
  const { T } = useLang();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [lightboxIdx, setLightboxIdx] = useState(-1);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("gallery").select("*").eq("active", true).order("display_order")
      .then(({ data }) => {
        if (data?.length) setItems(data);
        else setItems(DEFAULT_GALLERY.map((g, i) => ({ ...g, id: String(i), created_at: "" })));
      });
  }, []);

  const filtered = filter === "all" ? items : items.filter(g => g.category === filter);
  const slides = filtered.map(g => ({ src: g.image_url }));

  return (
    <>
      <Navbar />
      <main style={{ background: "#0A0A0A", minHeight: "100vh", paddingTop: "100px" }}>
        <div className="max-w-7xl mx-auto px-[5%] py-16">
          <div className="text-center mb-14">
            <p className="text-yellow-400 text-[10px] tracking-[5px] uppercase font-semibold mb-3">{T("gallery_eyebrow")}</p>
            <h1 className="font-cinzel text-4xl md:text-6xl font-black text-white">{T("gallery_title")}</h1>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap justify-center mb-12">
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-5 py-2 rounded-full border text-xs font-bold tracking-[2px] uppercase transition-all ${filter === f.key ? "bg-yellow-400 text-black border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.3)]" : "border-yellow-400/20 text-gray-500 hover:border-yellow-400/50 hover:text-yellow-400"}`}>
                {T(f.label)}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((item, i) => (
              <div key={item.id} className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl mb-3" onClick={() => setLightboxIdx(i)}>
                <div className="relative overflow-hidden">
                  <Image src={item.image_url} alt={item.caption || ""} width={600} height={400}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ aspectRatio: i % 3 === 0 ? "3/4" : "4/3" }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end p-4 opacity-0 group-hover:opacity-100">
                    <span className="text-white text-xs font-bold tracking-widest uppercase">{item.caption}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-gray-600">
              <p className="text-5xl mb-4">📸</p>
              <p className="tracking-widest text-sm">No items in this category yet</p>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <Lightbox open={lightboxIdx >= 0} close={() => setLightboxIdx(-1)}
        index={lightboxIdx} slides={slides}
        styles={{ container: { background: "rgba(0,0,0,0.97)" } }}
      />
    </>
  );
}
