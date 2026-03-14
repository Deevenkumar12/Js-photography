"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function ResetPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { toast.error(error.message); setLoading(false); return; }
    toast.success("Password updated! Please login.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "#0A0A0A" }}>
      <div className="glass-card rounded-2xl p-10 w-full max-w-md border border-yellow-400/15">
        <h2 className="font-cinzel text-2xl font-bold text-white text-center mb-8">Set New Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input type="password" placeholder="New password (min 8 chars)" minLength={8} required value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-white/[0.04] border border-yellow-400/15 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-yellow-400 transition-all" />
          <button type="submit" disabled={loading} className="w-full py-4 bg-yellow-400 text-black rounded-xl font-bold text-sm tracking-[2px] uppercase disabled:opacity-60">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
