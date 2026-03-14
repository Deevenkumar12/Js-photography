"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/context/LangContext";
import LangToggle from "./LangToggle";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const { T } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string | null; role?: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        setUser({ email: user.email, role: profile?.role });
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (session?.user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
        setUser({ email: session.user.email, role: profile?.role });
      } else setUser(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); };

  const links = [
    { href: "/", label: T("nav_home") },
    { href: "/#about", label: T("nav_about") },
    { href: "/#services", label: T("nav_services") },
    { href: "/gallery", label: T("nav_gallery") },
    { href: "/#booking", label: T("nav_booking") },
    { href: "/#booking", label: T("nav_contact") },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[900] transition-all duration-500 ${scrolled ? "py-3 border-b border-yellow-400/10" : "py-5"}`}
        style={scrolled ? { background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)" } : {}}>
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          <Link href="/" className="font-cinzel text-2xl font-black text-yellow-400 tracking-widest" style={{ textShadow: "0 0 20px rgba(255,215,0,0.3)" }}>
            JS<span className="text-white font-normal"> PHOTOGRAPHY</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-7">
            {links.map((l, i) => (
              <li key={i}>
                <Link href={l.href} className="text-gray-400 hover:text-yellow-400 text-xs tracking-[2px] font-semibold uppercase transition-colors relative group">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-yellow-400 transition-all group-hover:w-full" />
                </Link>
              </li>
            ))}
            {user?.role === "admin" && (
              <li><Link href="/admin" className="text-yellow-400 text-xs tracking-[2px] font-bold uppercase">⚙ Admin</Link></li>
            )}
          </ul>

          <div className="hidden lg:flex items-center gap-4">
            <LangToggle />
            {user ? (
              <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-yellow-400 tracking-widest transition-colors">{T("nav_logout")}</button>
            ) : (
              <Link href="/login" className="text-xs text-gray-400 hover:text-yellow-400 tracking-widest transition-colors">{T("nav_login")}</Link>
            )}
            <Link href="/#booking" className="bg-yellow-400 text-black px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all">
              {T("nav_book")}
            </Link>
          </div>

          {/* Hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <LangToggle />
            <button onClick={() => setMenuOpen(o => !o)} className="flex flex-col gap-1.5 p-1">
              <span className={`block w-6 h-0.5 bg-yellow-400 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-yellow-400 transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-yellow-400 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[899] flex flex-col items-center justify-center gap-8" style={{ background: "rgba(10,10,10,0.98)" }}>
          {links.map((l, i) => (
            <Link key={i} href={l.href} onClick={() => setMenuOpen(false)} className="font-cinzel text-xl text-white hover:text-yellow-400 tracking-widest transition-colors">
              {l.label}
            </Link>
          ))}
          {user?.role === "admin" && <Link href="/admin" onClick={() => setMenuOpen(false)} className="font-cinzel text-xl text-yellow-400 tracking-widest">⚙ Admin</Link>}
          <Link href="/#booking" onClick={() => setMenuOpen(false)} className="font-cinzel text-xl text-yellow-400 tracking-widest">✦ {T("nav_book")}</Link>
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-sm text-gray-400">{T("nav_logout")}</button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm text-gray-400">{T("nav_login")}</Link>
          )}
        </div>
      )}
    </>
  );
}
