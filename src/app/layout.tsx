import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProvider from "@/components/ScrollProvider";
import CursorOrb from "@/components/CursorOrb";
import WhatsAppButton from "@/components/WhatsAppButton";
import LucyButton from "@/components/LucyButton";
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
  description: "Physician-led individualized homeopathic care with transparent care pathways, structured follow-up and in-person or online consultations with Dr. Narayan Jethwani.",
  manifest: "/manifest.json",
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
    icon: [
      { url: "/favicon.ico?v=3", type: "image/x-icon" },
      { url: "/icon.png?v=3", type: "image/png", sizes: "32x32" }
    ],
    shortcut: "/favicon.ico?v=3",
    apple: "/icon.png?v=3",
  },
  openGraph: {
    title: "Homeo Healthcare | Advanced Homeopathic Care for Modern Life",
    description: "Physician-led individualized homeopathic care with transparent pathways and structured follow-up.",
    url: "https://homeo.healthcare",
    siteName: "Homeo Healthcare",
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isPortal = host.includes("portal.homeo.healthcare");
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var activeTheme = theme || 'light';
                  if (activeTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                if (window.location.pathname.startsWith('/admin')) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (var i = 0; i < registrations.length; i++) {
                      registrations[i].unregister();
                    }
                  });
                } else {
                  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                  if (!isSafari) {
                    var registerSW = function() {
                      navigator.serviceWorker.register('/sw.js').then(function(reg) {
                        console.log('Homeo Healthcare ServiceWorker registered on scope: ', reg.scope);
                      }).catch(function(err) {
                        console.error('ServiceWorker registration failed: ', err);
                      });
                    };
                    if (document.readyState === 'complete' || document.readyState === 'interactive') {
                      registerSW();
                    } else {
                      window.addEventListener('load', registerSW);
                    }
                  }
                }
              }
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-pearl text-[#1A2421]">
        <ScrollProvider>
          <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col justify-between">
            {/* Dynamic Interactive WebGL Background */}
            <ClientCanvasWrapper />

            {/* Custom Physics Cursor & Ambient Glowing Orb */}
            {!isPortal && <CursorOrb />}

            {/* Navigation Bar */}
            {!isPortal && <Navbar />}

            {/* Main Content Area */}
            <main className="relative z-10 w-full flex-grow">
              {children}
            </main>

            {/* Futuristic Minimal Footer */}
            {!isPortal && <Footer />}

            {/* Floating WhatsApp Quick-Chat Action */}
            {!isPortal && <WhatsAppButton />}

            {/* Floating Lucy Assistant Action */}
            {!isPortal && <LucyButton />}
          </div>
        </ScrollProvider>
      </body>
    </html>
  );
}
