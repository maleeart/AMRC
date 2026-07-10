import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "โหวตสีเสื้อ - ชมรมวิทยุสมัครเล่น กฟผ.",
  description: "ร่วมโหวตสีเสื้อสำหรับกิจกรรมชมรมวิทยุสมัครเล่น",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
