import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tidemark — Live Crypto Broker",
  description:
    "Live crypto brokerage: real market prices, real accounts, real order ledger. Connect Alpaca/Coinbase for regulated settlement.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased tide-bg">{children}</body>
    </html>
  );
}
