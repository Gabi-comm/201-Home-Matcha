import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter_Tight, Jost, Roboto_Mono } from "next/font/google";
import { Header, Logo, TabBar } from "@/components/Chrome";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const bodoni = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], weight: "400", variable: "--font-bodoni" });
const jost = Jost({ subsets: ["latin"], style: "italic", weight: "300", variable: "--font-jost" });
const interTight = Inter_Tight({ subsets: ["latin"], weight: ["800", "900"], variable: "--font-inter-tight" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-roboto-mono" });

export const metadata: Metadata = {
  title: { default: "201 Home Matcha", template: "%s · 201 Home Matcha" },
  description: "Ceremonial-style matcha, whisked at home and poured over ice. Iced, 12 oz., pick-up or delivery.",
};

export const viewport: Viewport = {
  themeColor: "#37431a",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${jost.variable} ${interTight.variable} ${robotoMono.variable}`}>
      {/* Extensions such as ColorZilla add attributes to <body> before hydration; ignore those only. */}
      <body suppressHydrationWarning>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <StoreProvider>
          <Header />
          <main id="main">
            {children}
            <footer className="wrap">
              <Logo label="201 home matcha" />
              <span>Iced · 12 oz. · Pick-up or delivery</span>
            </footer>
          </main>
          <TabBar />
        </StoreProvider>
      </body>
    </html>
  );
}
