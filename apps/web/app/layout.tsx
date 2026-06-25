import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "jotter.md",
  description: "A Markdown notepad for agents and humans.",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
