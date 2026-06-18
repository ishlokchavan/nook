import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { InstallPrompt } from "@/components/pwa/install-prompt";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FAFAF8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover", // honour iOS safe-area insets in standalone mode
};

export const metadata: Metadata = {
  title: "Nook — Find Dubai's best interior makers",
  description:
    "Browse real carpentry, contracting and interior-design work in Dubai. Anonymous portfolios, structured requests, contact unlocked only when you're ready.",
  applicationName: "Nook",
  appleWebApp: {
    capable: true,
    title: "Nook",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-dvh font-sans">
        {children}
        <ServiceWorkerRegister />
        <InstallPrompt />
      </body>
    </html>
  );
}
