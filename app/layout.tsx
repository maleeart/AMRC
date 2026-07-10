import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ชมรมวิทยุสมัครเล่น กฟผ. | โหวตเสื้อ & ลงทะเบียน Rally",
  description: "โหวตสีและไซส์เสื้อ และลงทะเบียนเข้าร่วมกิจกรรม Rally กฟผ.-วังน้ำเขียว ชมรมวิทยุสมัครเล่น กฟผ.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
