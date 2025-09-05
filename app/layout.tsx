import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Provider from "./provider";
import ConditionalFooter from "./create-new-trip/_components/ConditionalFooter"; // ✅ Import conditional footer

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
              </main>
              {/* ✅ Conditional Footer - hides on CreateNewTrip page */}
              <ConditionalFooter />
           </Provider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
