import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/lib/context/LangContext";
import { Toaster } from "react-hot-toast";
import CustomCursor from "@/components/ui/CustomCursor";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

export const metadata: Metadata = {
  title: "JS Photography – Cinematic Wedding & Event Photography | Rajahmundry",
  description:
    "JS Photography – Premium wedding, event, drone & candid photography in Rajahmundry. Book your moment with M. Dharma Rao. Tel: 9492070597",
  keywords:
    "JS Photography, wedding photography Rajahmundry, drone photography, candid photography, baby shoots, pre-wedding, events, cinematography",
  openGraph: {
    title: "JS Photography – Cinematic Wedding Photography",
    description:
      "Premium wedding, event & cinematic photography in Rajahmundry, Andhra Pradesh.",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    ],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Raleway:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <LangProvider>
          <CustomCursor />
          {children}
          <WhatsAppFloat />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1a1a1a",
                color: "#F5F0E8",
                border: "1px solid rgba(255,215,0,0.3)",
                fontFamily: "Raleway, sans-serif",
              },
              success: {
                iconTheme: { primary: "#FFD700", secondary: "#000" },
              },
            }}
          />
        </LangProvider>
      </body>
    </html>
  );
}
