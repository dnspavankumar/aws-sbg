import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AWS Student Builder Group – BVRIT",
  description: "A student-driven technology community at BVRIT focused on cloud computing, AWS, hands-on learning, open source and collaborative project building. Learn. Build. Innovate.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
