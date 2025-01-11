import { fontPixel, fontSans, fontSerif } from "@/lib/fonts";
import type { Metadata } from "next/types";
import "./globals.css";

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
        className={`${fontSans.variable} ${fontSerif.variable} ${fontPixel.variable} ${fontSans.className} dark antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
