"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/context/LangContext";
import { BUSINESS } from "@/lib/constants";
import toast from "react-hot-toast";

const SERVICES_LIST = [
  { value: "Wedding", label: "💒 Wedding Photography" },
  { value: "Events", label: "🎉 Events" },
  { value: "PreWedding", label: "💑 Pre-Wedding Shoot" },
  { value: "Drone", label: "🚁 Drone Photography" },
  { value: "Candid", label: "📸 Candid Photography" },
  { value: "BabyShoots", label: "👶 Baby Shoots" },
  { value: "Cinematography", label: "🎬 Cinematography Video" },
  { value: "GiftArticles", label: "🎁 Gift Articles" },
];

export default function BookingSection() {
  const { T } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "Wedding", date: "", message: "" });

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSubmitted(true);
      toast.success("Booking request sent! We'll contact you soon.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/[0.04] border border-yellow-400/15 rounded-xl px-4 py-3 text-white text-sm font-raleway focus:border-yellow-400 focus:shadow-[0_0_20px_rgba(255,215,0,0.1)] transition-all outline-none placeholder:text-gray-600";

  return (
    <section id="booking" className="py-24 px-[5%]" style={{ background: "linear-gradient(180deg,#0b0b0f 0%,#0A0A0A 100%)" }}>
      <div className="max-w-7xl mx-auto">
        <RevealDiv className="text-center mb-16">
          <p className="text-yellow-400 text-[10px] tracking-[5px] uppercase font-semibold mb-3">{T("booking_eyebrow")}</p>
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white">{T("booking_title")}</h2>
        </RevealDiv>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Info */}
          <RevealDiv>
            <p className="text-gray-400 leading-8 mb-8 text-sm">{T("booking_desc")}</p>
            {[
              { icon: "📍", label: T("loc_label"), val: BUSINESS.address },
              { icon: "📞", label: T("phone_label"), val: `${BUSINESS.phone1} / ${BUSINESS.phone2}` },
              { icon: "✉️", label: T("email_label"), val: BUSINESS.email },
              { icon: "🕐", label: T("hours_label"), val: BUSINESS.timings },
            ].map(c => (
              <div key={c.label} className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 min-w-11 rounded-xl flex items-center justify-center text-lg border border-yellow-400/20" style={{ background: "rgba(255,215,0,0.06)" }}>{c.icon}</div>
                <div>
                  <strong className="block text-white text-sm font-semibold mb-0.5">{c.label}</strong>
                  <span className="text-yellow-400 text-sm">{c.val}</span>
                </div>
              </div>
            ))}
            <div className="flex gap-3 mt-8">
              <a href={BUSINESS.youtube} target="_blank" rel="noopener" className="border border-yellow-400/20 text-yellow-400 px-4 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-yellow-400 hover:text-black transition-all">▶ YouTube</a>
              <a href={BUSINESS.instagram} target="_blank" rel="noopener" className="border border-yellow-400/20 text-yellow-400 px-4 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-yellow-400 hover:text-black transition-all">◉ Instagram</a>
            </div>
          </RevealDiv>

          {/* Form */}
          <RevealDiv className="[transition-delay:0.2s]">
            <div className="glass-card rounded-2xl p-8 md:p-10">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                    <div className="text-6xl mb-4 bounce-in">🎉</div>
                    <h3 className="font-cinzel text-2xl text-yellow-400 mb-3">{T("booking_success_title")}</h3>
                    <p className="text-gray-400 text-sm mb-6">{T("booking_success_desc")}</p>
                    <button onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", service: "Wedding", date: "", message: "" }); }}
                      className="bg-yellow-400 text-black px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:opacity-80 transition-opacity">
                      {T("booking_new")}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase font-semibold block mb-2">{T("form_name")}</label>
                        <input className={inputClass} placeholder="Full Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase font-semibold block mb-2">{T("form_phone")}</label>
                        <input className={inputClass} type="tel" placeholder="Mobile Number" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase font-semibold block mb-2">{T("form_email")}</label>
                      <input className={inputClass} type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase font-semibold block mb-2">{T("form_service")}</label>
                        <select className={inputClass} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                          {SERVICES_LIST.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase font-semibold block mb-2">{T("form_date")}</label>
                        <input className={inputClass} type="date" required min={today} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase font-semibold block mb-2">{T("form_message")}</label>
                      <textarea className={`${inputClass} resize-none h-24`} placeholder="Tell us about your event..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-4 bg-yellow-400 text-black rounded-xl font-bold text-sm tracking-[2px] uppercase transition-all hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] hover:-translate-y-0.5 disabled:opacity-60">
                      {loading ? "Sending..." : T("form_submit")}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
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
