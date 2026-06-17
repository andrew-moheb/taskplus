import type { Metadata } from "next";
import { bodyFont, headingFont } from "@/lib/fonts";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { theme } from "@/lib/mantineTheme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buy2 App",
  description: "Next.js App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col  text-text">
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
