import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LogOps Backend",
  description: "Log Monitoring Backend Service",
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
