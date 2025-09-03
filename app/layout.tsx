import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Provider from "./provider"; // ✅ import your custom Provider
import Yatrafooterwraper from "./_components/Yatrafooterwraper";

export const metadata: Metadata = {
  title: "Yatra AI",
  description: "Yatra By the Help of AI",
  icons: "assets/Logo.svg",
};

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.className} min-h-screen`}>
          <ConvexClientProvider>
            <Provider>
              {/* ✅ Push content below fixed navbar */}
              <main className="pt-16">
                {children}
                <Yatrafooterwraper/>
              </main>
           </Provider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
