"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/context/LangContext";
import toast from "react-hot-toast";

type Mode = "login" | "signup" | "forgot";

export default function LoginPage() {
  const { T } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (error) { toast.error(error.message); setLoading(false); return; }
    toast.success("Welcome back!");
    router.push(redirect);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.name } },
    });
    if (error) { toast.error(error.message); setLoading(false); return; }
    // Upsert profile
    if (data.user) {
      await supabase.from("profiles").upsert({ id: data.user.id, email: form.email, full_name: form.name, role: "customer" });
    }
    toast.success("Account created! Please check your email to confirm.");
    setMode("login");
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/reset`,
    });
    if (error) { toast.error(error.message); setLoading(false); return; }
    toast.success("Password reset link sent to your email!");
    setLoading(false);
  };

  const inputClass = "w-full bg-white/[0.04] border border-yellow-400/15 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-yellow-400 focus:shadow-[0_0_20px_rgba(255,215,0,0.1)] transition-all placeholder:text-gray-600";

  const titles: Record<Mode, string> = { login: T("login_title"), signup: T("signup_title"), forgot: T("forgot_title") };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16" style={{ background: "radial-gradient(ellipse at center,#0d0d14 0%,#0A0A0A 100%)" }}>
      {/* Background rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[400, 600, 800].map(s => (
          <div key={s} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400/5"
            style={{ width: s, height: s }} />
        ))}
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-cinzel text-3xl font-black text-yellow-400 tracking-widest">JS<span className="text-white font-normal"> PHOTOGRAPHY</span></Link>
        </div>

        <div className="glass-card rounded-2xl p-8 md:p-10 border border-yellow-400/15">
          <h2 className="font-cinzel text-2xl font-bold text-white text-center mb-2">{titles[mode]}</h2>
          <p className="text-gray-600 text-sm text-center mb-8">M. Dharma Rao Photography Studio</p>

          <form onSubmit={mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleForgot} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">{T("signup_name")}</label>
                <input className={inputClass} placeholder="Your full name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
            )}
            <div>
              <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">{T("login_email")}</label>
              <input className={inputClass} type="email" placeholder="your@email.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            {mode !== "forgot" && (
              <div>
                <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">{T("login_pass")}</label>
                <input className={inputClass} type="password" placeholder="••••••••" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full py-4 mt-2 bg-yellow-400 text-black rounded-xl font-bold text-sm tracking-[2px] uppercase hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all disabled:opacity-60">
              {loading ? "Please wait..." : mode === "login" ? T("login_btn") : mode === "signup" ? T("signup_btn") : T("forgot_btn")}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            {mode === "login" && (
              <>
                <button onClick={() => setMode("forgot")} className="text-yellow-400/60 hover:text-yellow-400 text-xs transition-colors block mx-auto">{T("login_forgot")}</button>
                <button onClick={() => setMode("signup")} className="text-gray-500 hover:text-white text-xs transition-colors block mx-auto">{T("login_signup")}</button>
              </>
            )}
            {mode === "signup" && (
              <button onClick={() => setMode("login")} className="text-gray-500 hover:text-white text-xs transition-colors">{T("signup_login")}</button>
            )}
            {mode === "forgot" && (
              <button onClick={() => setMode("login")} className="text-gray-500 hover:text-white text-xs transition-colors">{T("forgot_back")}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
