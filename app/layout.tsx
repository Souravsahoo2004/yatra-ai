import type { Metadata } from "next";
import { Outfit} from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import  {ConvexClientProvider}  from "./ConvexClientProvider";

export const metadata: Metadata = {
  title: "Yatra AI",
  description: "Yatra By the Help of AI",
  icons:"assets/Logo.svg"
};


const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={outfit.className} 
      >

        
         <ConvexClientProvider>
        
          {children}
          </ConvexClientProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
