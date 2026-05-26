import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProvider from "@/components/ScrollProvider";
import CursorOrb from "@/components/CursorOrb";
import WhatsAppButton from "@/components/WhatsAppButton";
import ClientCanvasWrapper from "@/components/ClientCanvasWrapper";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});



export const metadata: Metadata = {
  title: "Homeo Healthcare | Advanced Homeopathic Care for Modern Life",
  description: "Experience next-generation personalized homeopathic healing driven by science and deep compassion. Book clinical and online consultations with Dr. Narayan Jethwani.",
  keywords: [
    "Homeopathy",
    "Futuristic Healthcare",
    "Personalized Healing",
    "Dr Narayan Jethwani",
    "Skin Disorders Treatment",
    "Respiratory Care",
    "Arthritis Homeopathy",
    "Holistic Wellness"
  ],
  authors: [{ name: "Dr. Narayan Jethwani" }],
  icons: {
    icon: "/favicon.ico?v=2",
    shortcut: "/favicon.ico?v=2",
    apple: "/favicon.ico?v=2",
  },
  openGraph: {
    title: "Homeo Healthcare | Advanced Homeopathic Care for Modern Life",
    description: "Experience next-generation personalized homeopathic healing driven by science and deep compassion.",
    url: "https://homeo.healthcare",
    siteName: "Homeo Healthcare",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-pearl text-[#1A2421]">
        <ScrollProvider>
          <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col justify-between">
            {/* Dynamic Interactive WebGL Background */}
            <ClientCanvasWrapper />

            {/* Custom Physics Cursor & Ambient Glowing Orb */}
            <CursorOrb />

            {/* Navigation Bar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="relative z-10 w-full flex-grow">
              {children}
            </main>

            {/* Futuristic Minimal Footer */}
            <Footer />

            {/* Floating WhatsApp Quick-Chat Action */}
            <WhatsAppButton />
          </div>
        </ScrollProvider>
      </body>
    </html>
  );
}
