import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import { getViewer } from "@/lib/auth";

import "./globals.css";

export const metadata: Metadata = {
  title: "FreightFlow",
  description: "An intelligent digital freight marketplace for shippers and carriers."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const viewer = await getViewer();

  return (
    <html lang="en">
      <body className="min-h-screen bg-mist text-ink antialiased">
        <div className="fixed inset-0 -z-10 bg-hero-grid" />
        <Navbar viewer={viewer} />
        {children}
      </body>
    </html>
  );
}
