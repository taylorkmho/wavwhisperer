import {
  JetBrains_Mono as FontMono,
  Micro_5 as FontPixel,
  Figtree as FontSans,
  Lora as FontSerif,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontPixel = FontPixel({
  subsets: ["latin"],
  variable: "--font-pixel",
  weight: ["400"],
  style: "normal",
  adjustFontFallback: false, // Suppress font override values warning for Micro 5
});

export const fontSerif = FontSerif({
  weight: "600",
  subsets: ["latin"],
  style: "italic",
  variable: "--font-serif",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
