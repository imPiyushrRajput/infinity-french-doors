import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/motion/SmoothScroll";
import ScrollProgress from "@/components/motion/ScrollProgress";
import { business } from "@/data/site";
import { JsonLd, NOINDEX, SITE_URL, organizationLd, websiteLd } from "@/lib/seo";

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const description =
  "Infinity French Doors manufactures galvanised steel French doors, safety doors, French windows, XXL doors and garden benches in Nashik and Jalgaon, delivered across India.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: business.pageTitle,
    template: `%s | ${business.brand}`,
  },
  description,
  applicationName: business.brand,
  keywords: [
    "French doors Nashik",
    "French windows",
    "safety doors",
    "galvanised steel doors",
    "XXL doors",
    "Infinity French Doors",
  ],
  openGraph: {
    type: "website",
    siteName: business.brand,
    title: business.pageTitle,
    description,
    locale: "en_IN",
    images: [{ url: business.logo, width: 920, height: 428, alt: business.brand }],
  },
  twitter: {
    card: "summary_large_image",
    title: business.pageTitle,
    description,
    images: [business.logo],
  },
  robots: NOINDEX ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b1b36",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>
          <ScrollProgress />
          <Header />
          <main id="content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
          <FloatingActions />
          <CustomCursor />
          <div className="grain" aria-hidden />
        </SmoothScroll>
      </body>
    </html>
  );
}
