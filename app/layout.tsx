import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafeTensor — Transparent Personal Loans up to ₹5 Lakhs",
  description: "Get personal loans with clear terms, quick disbursal, and no hidden surprises. Partnered with RBI-Regulated NBFCs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
