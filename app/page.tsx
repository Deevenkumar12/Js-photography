import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutSection from "@/components/sections/AboutSection";
import CountersSection from "@/components/sections/CountersSection";
import GalleryPreview from "@/components/sections/GalleryPreview";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import BookingSection from "@/components/sections/BookingSection";
import PageLoader from "@/components/ui/PageLoader";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: services }, { data: gallery }, { data: settings }] =
    await Promise.all([
      supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("display_order"),
      supabase
        .from("gallery")
        .select("*")
        .eq("active", true)
        .order("display_order")
        .limit(12),
      supabase.from("site_settings").select("*"),
    ]);

  const heroImages = settings
    ?.filter((s) => s.key.startsWith("hero_img_"))
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((s) => s.value)
    .filter(Boolean);

  return (
    <>
      <PageLoader />
      <Navbar />
      <main>
        <HeroSection heroImages={heroImages ?? undefined} />
        <ServicesSection services={services ?? undefined} />
        <AboutSection />
        <CountersSection />
        <GalleryPreview items={gallery ?? undefined} />
        <TestimonialsSection />
        <BookingSection />

        {/* Google Maps */}
        <div className="px-[5%] pb-24" style={{ background: "#0A0A0A" }}>
          <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden border border-yellow-400/10 h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3819.5!2d81.7799!3d17.0005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDAwJzAxLjgiTiA4McKwNDYnNDcuNiJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{
                border: "none",
                filter: "grayscale(80%) contrast(1.1) brightness(0.8)",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
