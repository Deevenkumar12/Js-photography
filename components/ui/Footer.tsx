"use client";
import Link from "next/link";
import { useLang } from "@/lib/context/LangContext";
import { BUSINESS } from "@/lib/constants";

export default function Footer() {
  const { T } = useLang();
  return (
    <footer className="border-t border-yellow-400/10 pt-16 pb-8 px-[5%]" style={{ background: "#050505" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="font-cinzel text-3xl font-black text-yellow-400 tracking-widest block mb-4">
              JS<span className="text-white font-normal"> PHOTOGRAPHY</span>
            </Link>
            <p className="text-gray-500 text-sm leading-7 max-w-xs">{T("footer_desc")}</p>
            <div className="flex gap-3 mt-5">
              <a href={BUSINESS.youtube} target="_blank" rel="noopener" className="w-9 h-9 rounded-full border border-yellow-400/20 flex items-center justify-center hover:bg-yellow-400 group transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-gray-500 group-hover:fill-black transition-all"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
              </a>
              <a href={BUSINESS.instagram} target="_blank" rel="noopener" className="w-9 h-9 rounded-full border border-yellow-400/20 flex items-center justify-center hover:bg-yellow-400 group transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-gray-500 group-hover:fill-black transition-all"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
          {/* Services */}
          <div>
            <h4 className="font-cinzel text-xs tracking-[3px] uppercase text-yellow-400 font-bold mb-5">{T("footer_services")}</h4>
            <ul className="space-y-2.5">
              {["Wedding Photography","Pre-Wedding Shoot","Drone Photography","Candid Photography","Baby Shoots","Gift Articles"].map(s => (
                <li key={s}><Link href="/#services" className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-xs tracking-[3px] uppercase text-yellow-400 font-bold mb-5">{T("footer_quick")}</h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">{T("nav_home")}</Link></li>
              <li><Link href="/#about" className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">{T("nav_about")}</Link></li>
              <li><Link href="/gallery" className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">{T("nav_gallery")}</Link></li>
              <li><Link href="/#booking" className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">{T("nav_book")}</Link></li>
              <li><Link href="/login" className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">{T("nav_login")}</Link></li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="font-cinzel text-xs tracking-[3px] uppercase text-yellow-400 font-bold mb-5">{T("footer_contact")}</h4>
            <ul className="space-y-3">
              <li><a href={`tel:${BUSINESS.phone1}`} className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">📞 {BUSINESS.phone1}</a></li>
              <li><a href={`tel:${BUSINESS.phone2}`} className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">📞 {BUSINESS.phone2}</a></li>
              <li><a href={`mailto:${BUSINESS.email}`} className="text-gray-500 hover:text-yellow-400 text-sm transition-colors break-all">✉️ {BUSINESS.email}</a></li>
              <li><span className="text-gray-500 text-sm">📍 {BUSINESS.address}</span></li>
              <li><span className="text-gray-500 text-sm">🕐 {BUSINESS.timings}</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-yellow-400/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-600">© 2026 <span className="text-yellow-400">JS Photography</span>. All rights reserved. {BUSINESS.owner}.</p>
          <p className="text-xs text-gray-600">Crafted with <span className="text-yellow-400">✦</span> for cinematic memories</p>
        </div>
      </div>
    </footer>
  );
}
