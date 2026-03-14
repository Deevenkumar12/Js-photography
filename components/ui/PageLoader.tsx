"use client";
import { useState, useEffect } from "react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-opacity duration-700"
      style={{ opacity: 1, background: "#0A0A0A" }}
    >
      <div className="font-cinzel text-5xl font-black text-yellow-400 tracking-[6px]">JS</div>
      <div className="font-cinzel text-xs text-gray-600 tracking-[8px] mt-1">PHOTOGRAPHY</div>
      <div className="w-48 h-0.5 bg-yellow-400/20 rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full loader-fill" />
      </div>
    </div>
  );
}
