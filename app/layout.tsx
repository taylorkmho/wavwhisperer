import { fontPixel, fontSans, fontSerif } from "@/lib/fonts";
import type { Metadata } from "next/types";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wav Whisperer",
  description: "Forecasting the future surf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontPixel.variable} ${fontSans.className} dark antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
