import type { Metadata } from "next/types";
import "./globals.css";
import { fontSans, fontSerif, fontPixel } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Wave Whisperer",
  description: "Forecasting the future surf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontPixel.variable} ${fontSans.className} antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}
