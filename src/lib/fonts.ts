import { Poppins } from "next/font/google";

export const headingFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
});

export const bodyFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300"],
  variable: "--font-body",
});
