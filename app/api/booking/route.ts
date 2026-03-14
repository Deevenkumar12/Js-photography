import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, service, date, message } = body;

    if (!name || !phone || !service || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        name,
        phone,
        email: email || null,
        service,
        event_date: date,
        message: message || null,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
    }

    // Emails (non-fatal)
    try {
      if (email) {
        await resend.emails.send({
          from: "JS Photography <onboarding@resend.dev>",
          to: [email],
          subject: "✦ Booking Confirmed – JS Photography, Rajahmundry",
          html: customerHtml({ name, service, date, phone }),
        });
      }
      await resend.emails.send({
        from: "JS Photography Bookings <onboarding@resend.dev>",
        to: [process.env.OWNER_EMAIL ?? "jsphotography8488@gmail.com"],
        subject: `🎉 New Booking: ${service} – ${name} (${phone})`,
        html: ownerHtml({ name, phone, email, service, date, message }),
      });
    } catch (emailErr) {
      console.error("Email error (non-fatal):", emailErr);
    }

    return NextResponse.json({ success: true, id: booking.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function customerHtml(p: { name: string; service: string; date: string; phone: string }) {
  return `<!DOCTYPE html><html><body style="background:#0A0A0A;color:#F5F0E8;font-family:'Helvetica Neue',Arial,sans-serif;margin:0;padding:40px 20px">
<div style="max-width:560px;margin:0 auto;background:#111;border:1px solid rgba(255,215,0,0.2);border-radius:16px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#111 0%,#1a1a0d 100%);padding:40px;text-align:center;border-bottom:1px solid rgba(255,215,0,0.15)">
    <h1 style="font-family:serif;color:#FFD700;font-size:2.5rem;margin:0;letter-spacing:4px">JS</h1>
    <p style="color:#888;font-size:10px;letter-spacing:6px;text-transform:uppercase;margin:4px 0 0">PHOTOGRAPHY</p>
  </div>
  <div style="padding:40px">
    <h2 style="color:#FFD700;font-family:serif;margin:0 0 8px">Booking Confirmed ✦</h2>
    <p style="color:#aaa;font-size:14px;margin:0 0 30px">Dear ${p.name}, thank you for choosing JS Photography!</p>
    <div style="background:rgba(255,215,0,0.05);border:1px solid rgba(255,215,0,0.1);border-radius:12px;padding:24px">
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="color:#888;font-size:12px;text-transform:uppercase;padding:8px 0;width:40%">Service</td><td style="color:#F5F0E8;font-weight:600;padding:8px 0">${p.service}</td></tr>
        <tr><td style="color:#888;font-size:12px;text-transform:uppercase;padding:8px 0">Date</td><td style="color:#F5F0E8;font-weight:600;padding:8px 0">${p.date}</td></tr>
        <tr><td style="color:#888;font-size:12px;text-transform:uppercase;padding:8px 0">Phone</td><td style="color:#FFD700;font-weight:600;padding:8px 0">${p.phone}</td></tr>
      </table>
    </div>
    <p style="color:#aaa;font-size:13px;margin:24px 0">We will contact you within <strong style="color:#FFD700">24 hours</strong> to confirm your appointment.</p>
    <div style="background:rgba(255,215,0,0.06);border-radius:10px;padding:20px;margin-top:20px">
      <p style="color:#888;font-size:11px;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px">Contact Us</p>
      <p style="color:#FFD700;font-size:14px;margin:4px 0">📞 9492070597 / 9491365499</p>
      <p style="color:#888;font-size:13px;margin:4px 0">📍 Mangalavaari Peta, Rajahmundry</p>
      <p style="color:#888;font-size:13px;margin:4px 0">🕐 9:30 AM – 9:00 PM</p>
    </div>
  </div>
  <div style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);text-align:center">
    <p style="color:#555;font-size:11px;margin:0">© 2026 JS Photography • M. Dharma Rao • Rajahmundry</p>
  </div>
</div></body></html>`;
}

function ownerHtml(p: { name: string; phone: string; email?: string; service: string; date: string; message?: string }) {
  return `<!DOCTYPE html><html><body style="background:#0A0A0A;color:#F5F0E8;font-family:Arial,sans-serif;margin:0;padding:40px 20px">
<div style="max-width:560px;margin:0 auto;background:#111;border:1px solid rgba(255,215,0,0.3);border-radius:16px;overflow:hidden">
  <div style="background:#FFD700;padding:20px 40px;text-align:center">
    <h1 style="color:#000;font-size:1.1rem;margin:0;letter-spacing:3px">🎉 NEW BOOKING REQUEST</h1>
  </div>
  <div style="padding:40px">
    <table style="width:100%;border-collapse:collapse">
      <tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;padding:12px 0;width:30%">Client</td><td style="color:#fff;font-size:14px;font-weight:600;padding:12px 0">${p.name}</td></tr>
      <tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;padding:12px 0">Phone</td><td style="color:#FFD700;font-size:14px;font-weight:600;padding:12px 0">${p.phone}</td></tr>
      <tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;padding:12px 0">Email</td><td style="color:#F5F0E8;font-size:14px;padding:12px 0">${p.email ?? "—"}</td></tr>
      <tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;padding:12px 0">Service</td><td style="color:#F5F0E8;font-size:14px;font-weight:600;padding:12px 0">${p.service}</td></tr>
      <tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;padding:12px 0">Date</td><td style="color:#F5F0E8;font-size:14px;padding:12px 0">${p.date}</td></tr>
      <tr><td style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;padding:12px 0">Message</td><td style="color:#F5F0E8;font-size:13px;padding:12px 0">${p.message ?? "—"}</td></tr>
    </table>
    <a href="tel:${p.phone}" style="display:inline-block;background:#FFD700;color:#000;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:24px;font-size:13px;letter-spacing:2px">📞 CALL CLIENT NOW</a>
  </div>
</div></body></html>`;
}
