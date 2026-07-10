"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BackButton from "../components/BackButton";

// [code, รอบอก, ความยาวเสื้อ] (นิ้ว)
const SIZES: [string, number, number][] = [
  ["SSS", 34, 25],
  ["SS", 36, 26],
  ["S", 38, 27],
  ["M", 40, 28],
  ["L", 42, 29],
  ["XL", 44, 30],
  ["2XL", 46, 31],
  ["3XL", 48, 32],
  ["4XL", 50, 33],
  ["5XL", 52, 34],
  ["6XL", 54, 35],
  ["7XL", 56, 36],
  ["8XL", 58, 37],
  ["9XL", 60, 38],
];

export default function VotePage() {
  const [name, setName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [color, setColor] = useState<"white" | "black" | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!color || !size) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, memberId, color, size }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("บันทึกการโหวตเรียบร้อยแล้ว!");
        setName("");
        setMemberId("");
        setColor(null);
        setSize(null);
      } else {
        setStatus("error");
        setMessage(data.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      setStatus("error");
      setMessage("ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่");
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-8 animate-[fadeIn_0.4s_ease]">
      <BackButton />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">👕</div>
        <h1 className="text-xl font-bold text-gray-800">โหวตสีและไซส์เสื้อ</h1>
        <p className="text-gray-500 text-sm mt-1">ชมรมวิทยุสมัครเล่น กฟผ.</p>
      </div>

      {status === "success" ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-green-600 font-semibold text-lg">{message}</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 text-blue-600 underline text-sm"
          >
            โหวตใหม่
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อ - สกุล <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="กรอกชื่อ-สกุล"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสประจำตัว <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="กรอกรหัสประจำตัว"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เลือกสีเสื้อ <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setColor("white")}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-5 transition-all duration-200 ${
                  color === "white"
                    ? "border-blue-500 bg-blue-50 shadow-md scale-105"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Image src="/demo/shirt-white.svg" alt="เสื้อขาว" width={72} height={90} className="mb-3 drop-shadow-sm" />
                <span className="font-semibold text-gray-800">ขาว</span>
                {color === "white" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setColor("black")}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-5 transition-all duration-200 ${
                  color === "black"
                    ? "border-blue-500 bg-blue-50 shadow-md scale-105"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Image src="/demo/shirt-black.svg" alt="เสื้อดำ" width={72} height={90} className="mb-3 drop-shadow-sm" />
                <span className="font-semibold text-gray-800">ดำ</span>
                {color === "black" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เลือกไซส์เสื้อ <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map(([code, chest, length]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSize(code)}
                  className={`flex flex-col items-center rounded-xl border-2 py-2 transition-all duration-200 ${
                    size === code
                      ? "border-blue-500 bg-blue-50 shadow-sm scale-105"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span className="font-bold text-gray-800">{code}</span>
                  <span className="text-[11px] text-gray-500">อก {chest}″</span>
                  <span className="text-[11px] text-gray-500">ยาว {length}″</span>
                </button>
              ))}
            </div>
          </div>

          {status === "error" && (
            <p className="text-red-500 text-sm text-center">{message}</p>
          )}

          <button
            type="submit"
            disabled={!color || !size || status === "loading"}
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl disabled:opacity-40 active:bg-blue-700 text-base transition-colors"
          >
            {status === "loading" ? "กำลังบันทึก..." : "บันทึกการโหวต"}
          </button>
        </form>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/results"
          className="flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl text-sm font-medium"
        >
          📊 ดูผลโหวตรวม
        </Link>
      </div>
    </main>
  );
}
