import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PidifyJs - Advanced PDF Playground",
  description: "Next.js replica of the PidifyJs React demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={'antialiased'}
      >
        {children}
      </body>
    </html>
  );
}
