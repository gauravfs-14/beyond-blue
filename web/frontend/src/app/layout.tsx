import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { Footer } from "@/components/footer";
import { MeteorsOverlay } from "@/components/ui/meteors";

export const metadata: Metadata = {
  title: "Beyond Blue - Exoplanet Explorer",
  description: "Discover and explore exoplanets from NASA data",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CosmicBackground>
            <Suspense fallback={null}>
              <MeteorsOverlay />
              <Header />
              {children}
              <Footer />
            </Suspense>
          </CosmicBackground>
        </ThemeProvider>
      </body>
    </html>
  );
}
