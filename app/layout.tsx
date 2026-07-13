import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERAC | ชมรมวิทยุสมัครเล่น กฟผ.",
  description: "โหวตสีและไซส์เสื้อ และลงทะเบียนเข้าร่วมกิจกรรม Rally กฟผ.-วังน้ำเขียว ชมรมวิทยุสมัครเล่น กฟผ.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
