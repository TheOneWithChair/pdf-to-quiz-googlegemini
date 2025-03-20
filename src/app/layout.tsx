// src/app/api/(preview)/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Use Inter or another Google font
import "./globals.css";
import { twMerge } from "tailwind-merge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pdf-to-quiz",
  description: "An AI powered quiz learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={twMerge(inter.className, "bg-black text-white antialiased")}
      >
        {children}
      </body>
    </html>
  );
}