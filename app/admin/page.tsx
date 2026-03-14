"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Booking, Service, GalleryItem } from "@/types";

type Tab = "dashboard" | "bookings" | "gallery" | "services" | "settings";

/* ═══════════════════════════════════════════════
   ROOT ADMIN PAGE
═══════════════════════════════════════════════ */
export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login?redirect=/admin"); return; }
      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role !== "admin") {
        toast.error("Unauthorized — admin only");
        router.push("/");
        return;
      }
      setUserEmail(user.email ?? "");
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0A0A" }}>
        <div className="font-cinzel text-yellow-400 text-xl tracking-widest animate-pulse">
          Loading Admin Dashboard…
        </div>
      </div>
    );

  const TABS: { key: Tab; icon: string; label: string }[] = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "bookings",  icon: "📋", label: "Bookings"  },
    { key: "gallery",   icon: "🖼",  label: "Gallery"   },
    { key: "services",  icon: "⚡",  label: "Services"  },
    { key: "settings",  icon: "🔧", label: "Settings"  },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A" }}>
      {/* Top header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-yellow-400/15"
        style={{ background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center gap-4">
          <span className="font-cinzel text-yellow-400 text-lg font-bold tracking-widest">
            ⚙ JS PHOTOGRAPHY
          </span>
          <span className="text-gray-600 text-xs tracking-widest uppercase hidden md:block">
            Admin Dashboard
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-xs hidden md:block">{userEmail}</span>
          <button
            onClick={() => { supabase.auth.signOut(); router.push("/"); }}
            className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-500/30 transition-all"
          >
            Logout
          </button>
          <a href="/" className="text-gray-600 hover:text-yellow-400 text-xs tracking-widest transition-colors">
            ← Site
          </a>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar — desktop */}
        <aside
          className="hidden md:flex flex-col w-56 min-h-[calc(100vh-61px)] border-r border-yellow-400/10 py-8 px-4"
          style={{ background: "#0a0a0a" }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-semibold tracking-wide transition-all text-left ${
                tab === t.key
                  ? "bg-yellow-400 text-black"
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </aside>

        {/* Mobile tabs */}
        <div
          className="md:hidden flex gap-2 overflow-x-auto p-3 border-b border-yellow-400/10 w-full"
          style={{ background: "#0A0A0A" }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                tab === t.key
                  ? "bg-yellow-400 text-black"
                  : "text-gray-600 border border-yellow-400/15"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-5 md:p-8 overflow-x-auto">
          {tab === "dashboard" && <DashboardTab />}
          {tab === "bookings"  && <BookingsTab  />}
          {tab === "gallery"   && <GalleryTab   />}
          {tab === "services"  && <ServicesTab  />}
          {tab === "settings"  && <SettingsTab  />}
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════ */
function DashboardTab() {
  const supabase = createClient();
  const [stats, setStats] = useState({ bookings: 0, newBookings: 0, gallery: 0, services: 0 });

  useEffect(() => {
    async function load() {
      const [b, nb, g, s] = await Promise.all([
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("gallery").select("*",  { count: "exact", head: true }),
        supabase.from("services").select("*", { count: "exact", head: true }),
      ]);
      setStats({ bookings: b.count ?? 0, newBookings: nb.count ?? 0, gallery: g.count ?? 0, services: s.count ?? 0 });
    }
    load();

    const ch = supabase.channel("admin-dash")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "bookings" }, () => {
        setStats((s) => ({ ...s, bookings: s.bookings + 1, newBookings: s.newBookings + 1 }));
        toast.success("🎉 New booking received!", { duration: 5000 });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const cards = [
    { label: "Total Bookings", val: stats.bookings,    icon: "📋", color: "#FFD700" },
    { label: "Pending New",    val: stats.newBookings,  icon: "🔔", color: "#E63946" },
    { label: "Gallery Items",  val: stats.gallery,      icon: "🖼",  color: "#4361EE" },
    { label: "Services",       val: stats.services,     icon: "⚡", color: "#2ed573" },
  ];

  return (
    <div>
      <h2 className="font-cinzel text-2xl text-yellow-400 mb-8 tracking-widest">Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="glass-card rounded-2xl p-6 border border-yellow-400/10">
            <div className="text-3xl mb-3">{c.icon}</div>
            <div className="font-cinzel text-4xl font-black mb-1" style={{ color: c.color }}>{c.val}</div>
            <div className="text-xs text-gray-500 tracking-widest uppercase">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="glass-card rounded-2xl p-6 border border-yellow-400/10">
        <h3 className="font-cinzel text-yellow-400 text-sm tracking-widest mb-4">Business Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
          <p>📍 Mangalavaari Peta, Rajahmundry</p>
          <p>📞 9492070597 / 9491365499</p>
          <p>✉️ jsphotography8488@gmail.com</p>
          <p>🕐 9:30 AM – 9:00 PM (Daily)</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   BOOKINGS
═══════════════════════════════════════════════ */
function BookingsTab() {
  const supabase = createClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase
      .from("bookings").select("*").order("created_at", { ascending: false });
    setBookings(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
    const ch = supabase.channel("bookings-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, fetch)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const updateStatus = async (id: string, status: "confirmed" | "cancelled") => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    toast.success(`Booking ${status}!`);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this booking permanently?")) return;
    await supabase.from("bookings").delete().eq("id", id);
    toast.success("Deleted");
  };

  return (
    <div>
      <h2 className="font-cinzel text-2xl text-yellow-400 mb-8 tracking-widest">
        All Bookings {!loading && <span className="text-base text-gray-600">({bookings.length})</span>}
      </h2>
      {loading ? (
        <p className="text-gray-600 animate-pulse">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-yellow-400/10">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr style={{ background: "rgba(255,215,0,0.05)" }}>
                {["#", "Name", "Phone", "Service", "Date", "Message", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs tracking-[2px] uppercase text-yellow-400 border-b border-yellow-400/15 font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-20 text-gray-600">
                    No bookings yet. Share your website to get customers!
                  </td>
                </tr>
              ) : (
                bookings.map((b, i) => (
                  <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02] group">
                    <td className="py-3 px-4 text-gray-600 text-sm">{i + 1}</td>
                    <td className="py-3 px-4 text-white font-semibold text-sm">{b.name}</td>
                    <td className="py-3 px-4 text-sm">
                      <a href={`tel:${b.phone}`} className="text-yellow-400 hover:underline">{b.phone}</a>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{b.service}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{b.event_date}</td>
                    <td className="py-3 px-4 text-gray-600 text-xs max-w-[160px] truncate">{b.message ?? "—"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                          b.status === "confirmed"
                            ? "bg-green-500/15 text-green-400"
                            : b.status === "cancelled"
                            ? "bg-red-500/15 text-red-400"
                            : "bg-yellow-400/15 text-yellow-400"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {b.status === "new" && (
                          <button
                            onClick={() => updateStatus(b.id, "confirmed")}
                            className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-500/30 transition-all"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          onClick={() => del(b.id)}
                          className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-500/30 transition-all"
                        >
                          ✗
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   GALLERY
═══════════════════════════════════════════════ */
function GalleryTab() {
  const supabase = createClient();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [url, setUrl] = useState("");
  const [cat, setCat] = useState("wedding");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from("gallery").select("*").order("display_order");
    setItems(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `gallery/${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("images").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed: " + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(path);
    setUrl(publicUrl);
    toast.success("Uploaded! Click Add to Gallery.");
    setUploading(false);
  };

  const add = async () => {
    if (!url) { toast.error("Please enter or upload an image"); return; }
    const { error } = await supabase.from("gallery").insert({
      image_url: url, category: cat, caption, display_order: items.length + 1, active: true,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Added to gallery!");
    setUrl(""); setCaption(""); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Remove image from gallery?")) return;
    await supabase.from("gallery").delete().eq("id", id);
    load(); toast.success("Removed");
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from("gallery").update({ active: !active }).eq("id", id);
    load();
  };

  const inp = "w-full bg-white/[0.04] border border-yellow-400/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-400 transition-all";

  return (
    <div>
      <h2 className="font-cinzel text-2xl text-yellow-400 mb-8 tracking-widest">Gallery Manager</h2>

      {/* Add form */}
      <div className="glass-card rounded-2xl p-6 border border-yellow-400/10 mb-8 max-w-2xl">
        <h3 className="font-cinzel text-sm text-yellow-400 tracking-widest mb-5">Add New Image</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="border border-yellow-400/30 text-yellow-400 px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-yellow-400/10 transition-all disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "📁 Upload Image"}
            </button>
            <span className="text-gray-600 text-xs">or paste URL below</span>
          </div>
          <input className={inp} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://... image URL" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">Category</label>
              <select className={inp} value={cat} onChange={(e) => setCat(e.target.value)}>
                {["wedding","prewedding","candid","drone","baby","events"].map((c) => (
                  <option key={c} value={c} style={{ background: "#1a1a1a" }}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">Caption</label>
              <input className={inp} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Wedding Ceremony" />
            </div>
          </div>
          {url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="preview" className="h-24 w-36 object-cover rounded-lg border border-yellow-400/20" />
          )}
          <button onClick={add} className="bg-yellow-400 text-black px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase hover:opacity-85 transition-opacity">
            + Add to Gallery
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`relative rounded-xl overflow-hidden border transition-all ${
              item.active ? "border-yellow-400/20" : "border-red-500/20 opacity-50"
            }`}
          >
            <div className="relative h-28">
              <Image src={item.image_url} alt={item.caption ?? ""} fill className="object-cover" sizes="200px" />
            </div>
            <div className="p-2" style={{ background: "rgba(0,0,0,0.8)" }}>
              <p className="text-xs text-gray-400 truncate mb-0.5">{item.caption ?? item.category}</p>
              <p className="text-[10px] text-yellow-400/60 mb-2">{item.category}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleActive(item.id, item.active)}
                  className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${
                    item.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {item.active ? "✓ ON" : "OFF"}
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="flex-1 py-1 rounded text-[10px] font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SERVICES
═══════════════════════════════════════════════ */
function ServicesTab() {
  const supabase = createClient();
  const [services, setServices] = useState<Service[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", title_te: "", description: "", description_te: "",
    price: "", icon: "", image_url: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("services").select("*").order("display_order");
    setServices(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (s: Service) => {
    setEditId(s.id);
    setForm({
      title: s.title, title_te: s.title_te ?? "", description: s.description,
      description_te: s.description_te ?? "", price: s.price, icon: s.icon, image_url: s.image_url,
    });
  };

  const save = async () => {
    if (!editId) return;
    const { error } = await supabase.from("services").update(form).eq("id", editId);
    if (error) { toast.error(error.message); return; }
    toast.success("Service updated!");
    setEditId(null);
    load();
  };

  const uploadImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `services/${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("images").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: publicUrl }));
    toast.success("Image uploaded!");
    setUploading(false);
  };

  const inp = "w-full bg-white/[0.04] border border-yellow-400/15 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-yellow-400 transition-all";

  if (editId) {
    return (
      <div>
        <h2 className="font-cinzel text-2xl text-yellow-400 mb-8 tracking-widest">Editing: {form.title}</h2>
        <div className="glass-card rounded-2xl p-8 border border-yellow-400/20 max-w-2xl space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">Title (English)</label>
              <input className={inp} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">Title (Telugu)</label>
              <input className={inp} value={form.title_te} onChange={(e) => setForm((f) => ({ ...f, title_te: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">Description (English)</label>
            <textarea rows={2} className={`${inp} resize-none`} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">Description (Telugu)</label>
            <textarea rows={2} className={`${inp} resize-none`} value={form.description_te} onChange={(e) => setForm((f) => ({ ...f, description_te: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">Price</label>
              <input className={inp} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            </div>
            <div>
              <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">Icon (emoji)</label>
              <input className={inp} value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">Service Image</label>
            <div className="flex gap-3 items-center mb-2">
              <input ref={fileRef} type="file" accept="image/*" onChange={uploadImg} className="hidden" />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="border border-yellow-400/30 text-yellow-400 px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-400/10 transition-all disabled:opacity-60">
                {uploading ? "Uploading…" : "📁 Upload"}
              </button>
              <input className={`${inp} flex-1`} value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} placeholder="or paste URL" />
            </div>
            {form.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image_url} alt="preview" className="h-24 w-36 object-cover rounded-lg border border-yellow-400/20" />
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={save} className="flex-1 bg-yellow-400 text-black py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:opacity-85 transition-opacity">
              💾 Save Changes
            </button>
            <button onClick={() => setEditId(null)} className="border border-yellow-400/20 text-gray-500 px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-cinzel text-2xl text-yellow-400 mb-8 tracking-widest">Services Manager</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s.id} className="glass-card rounded-xl overflow-hidden border border-yellow-400/10 group">
            <div className="relative h-36 overflow-hidden">
              <Image src={s.image_url} alt={s.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.85),transparent)" }} />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="text-xl">{s.icon}</span>
                <span className="font-cinzel text-white text-sm font-bold">{s.title}</span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-yellow-400 text-xs font-semibold mb-1">{s.price}</p>
              <p className="text-gray-600 text-xs line-clamp-2 mb-3">{s.description}</p>
              <button
                onClick={() => startEdit(s)}
                className="w-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-yellow-400 hover:text-black transition-all"
              >
                ✏️ Edit Service
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SETTINGS
═══════════════════════════════════════════════ */
function SettingsTab() {
  const supabase = createClient();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);
  const heroRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [heroFiles, setHeroFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const loadSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    const m: Record<string, string> = {};
    data?.forEach((r) => { m[r.key] = r.value; });
    setSettings(m);
  };

  useEffect(() => { loadSettings(); }, []);

  const upsert = async (key: string, value: string) => {
    await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
  };

  const uploadFile = async (file: File, path: string) => {
    const { error } = await supabase.storage.from("images").upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      if (logoFile) {
        const url = await uploadFile(logoFile, `site/logo.${logoFile.name.split(".").pop()}`);
        await upsert("logo_url", url);
      }
      for (let i = 0; i < 4; i++) {
        const f = heroFiles[i];
        if (f) {
          const url = await uploadFile(f, `site/hero_${i + 1}.${f.name.split(".").pop()}`);
          await upsert(`hero_img_${i + 1}`, url);
        } else if (settings[`hero_img_${i + 1}`]) {
          await upsert(`hero_img_${i + 1}`, settings[`hero_img_${i + 1}`]);
        }
      }
      for (const key of ["business_name","phone1","phone2","email","address","banner_text","banner_show"]) {
        if (settings[key] !== undefined) await upsert(key, settings[key]);
      }
      toast.success("All settings saved!");
      loadSettings();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full bg-white/[0.04] border border-yellow-400/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-400 transition-all";
  const F = (key: string, label: string, ph = "") => (
    <div>
      <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">{label}</label>
      <input className={inp} value={settings[key] ?? ""} onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))} placeholder={ph} />
    </div>
  );

  return (
    <div>
      <h2 className="font-cinzel text-2xl text-yellow-400 mb-8 tracking-widest">Site Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Business Info */}
        <div className="glass-card rounded-2xl p-6 border border-yellow-400/10 space-y-4">
          <h3 className="font-cinzel text-sm text-yellow-400 tracking-widest">Business Information</h3>
          {F("business_name", "Business Name", "JS Photography")}
          {F("phone1", "Phone 1", "9492070597")}
          {F("phone2", "Phone 2", "9491365499")}
          {F("email", "Email", "jsphotography8488@gmail.com")}
          {F("address", "Address", "Mangalavaari Peta, Rajahmundry")}
        </div>

        {/* Logo */}
        <div className="glass-card rounded-2xl p-6 border border-yellow-400/10 space-y-4">
          <h3 className="font-cinzel text-sm text-yellow-400 tracking-widest">Logo Upload</h3>
          {settings.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo_url} alt="logo" className="h-16 object-contain border border-yellow-400/20 rounded-lg p-2" />
          )}
          <input ref={logoRef} type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} className="hidden" />
          <button onClick={() => logoRef.current?.click()} className="border border-yellow-400/30 text-yellow-400 px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-400/10 transition-all">
            📁 Choose Logo File
          </button>
          {logoFile && <p className="text-green-400 text-xs">✓ {logoFile.name}</p>}
        </div>

        {/* Hero Images */}
        <div className="glass-card rounded-2xl p-6 border border-yellow-400/10 lg:col-span-2">
          <h3 className="font-cinzel text-sm text-yellow-400 tracking-widest mb-5">Hero Slideshow Images (4 slides)</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block">Slide {i + 1}</label>
                {settings[`hero_img_${i + 1}`] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings[`hero_img_${i + 1}`]} alt="" className="h-20 w-full object-cover rounded-lg border border-yellow-400/20" />
                )}
                <input
                  ref={heroRefs[i]}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const arr = [...heroFiles];
                    arr[i] = e.target.files?.[0] ?? null;
                    setHeroFiles(arr);
                  }}
                  className="hidden"
                />
                <button
                  onClick={() => heroRefs[i].current?.click()}
                  className="w-full border border-yellow-400/20 text-yellow-400 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-yellow-400/10 transition-all"
                >
                  {heroFiles[i] ? `✓ ${heroFiles[i]!.name.slice(0, 12)}` : "Upload"}
                </button>
                <input
                  className="w-full bg-white/[0.04] border border-yellow-400/10 rounded-lg px-3 py-1.5 text-white text-xs outline-none focus:border-yellow-400 transition-all"
                  value={settings[`hero_img_${i + 1}`] ?? ""}
                  onChange={(e) => setSettings((s) => ({ ...s, [`hero_img_${i + 1}`]: e.target.value }))}
                  placeholder="or paste URL"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Banner */}
        <div className="glass-card rounded-2xl p-6 border border-yellow-400/10 space-y-4">
          <h3 className="font-cinzel text-sm text-yellow-400 tracking-widest">Announcement Banner</h3>
          {F("banner_text", "Banner Message", "Special offer this season!")}
          <div>
            <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">Show Banner?</label>
            <select className={inp} value={settings.banner_show ?? "no"} onChange={(e) => setSettings((s) => ({ ...s, banner_show: e.target.value }))}>
              <option value="yes" style={{ background: "#1a1a1a" }}>Yes — Show it</option>
              <option value="no"  style={{ background: "#1a1a1a" }}>No — Hide it</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="glass-card rounded-2xl p-6 border border-yellow-400/10">
          <h3 className="font-cinzel text-sm text-yellow-400 tracking-widest mb-5">Change Admin Password</h3>
          <PasswordChange />
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={saveAll}
          disabled={saving}
          className="bg-yellow-400 text-black px-10 py-4 rounded-xl font-bold text-sm tracking-[2px] uppercase hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all disabled:opacity-60"
        >
          {saving ? "Saving…" : "💾 Save All Settings"}
        </button>
      </div>
    </div>
  );
}

function PasswordChange() {
  const supabase = createClient();
  const [np, setNp] = useState("");
  const [cp, setCp] = useState("");
  const [saving, setSaving] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (np !== cp) { toast.error("Passwords do not match"); return; }
    if (np.length < 8) { toast.error("Minimum 8 characters"); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: np });
    if (error) { toast.error(error.message); setSaving(false); return; }
    toast.success("Password updated!");
    setNp(""); setCp(""); setSaving(false);
  };

  const inp = "w-full bg-white/[0.04] border border-yellow-400/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-400 transition-all";

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">New Password</label>
        <input type="password" className={inp} value={np} onChange={(e) => setNp(e.target.value)} placeholder="Min 8 characters" />
      </div>
      <div>
        <label className="text-yellow-400 text-[10px] tracking-[2px] uppercase block mb-2">Confirm Password</label>
        <input type="password" className={inp} value={cp} onChange={(e) => setCp(e.target.value)} placeholder="Repeat new password" />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-60"
      >
        {saving ? "Updating…" : "🔒 Update Password"}
      </button>
    </form>
  );
}
