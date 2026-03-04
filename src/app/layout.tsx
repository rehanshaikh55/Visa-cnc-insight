import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VISA CNC Insights",
  description: "IIoT CNC Machine Monitoring Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
