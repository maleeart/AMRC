"use client";

import { useState } from "react";
import Link from "next/link";

export default function VotePage() {
  const [name, setName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [color, setColor] = useState<"white" | "black" | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!color) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, memberId, color }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("บันทึกการโหวตเรียบร้อยแล้ว!");
        setName("");
        setMemberId("");
        setColor(null);
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
    <main className="max-w-md mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">📻</div>
        <h1 className="text-xl font-bold text-gray-800">ชมรมวิทยุสมัครเล่น</h1>
        <p className="text-gray-500 text-sm mt-1">โหวตสีเสื้อสำหรับกิจกรรม</p>
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
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-5 transition-all ${
                  color === "white"
                    ? "border-blue-500 bg-blue-50 shadow-md scale-105"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="w-16 h-20 rounded-lg bg-white border-2 border-gray-300 shadow-sm mb-3 flex items-center justify-center text-2xl">
                  👕
                </div>
                <span className="font-semibold text-gray-800">ขาว</span>
                {color === "white" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setColor("black")}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-5 transition-all ${
                  color === "black"
                    ? "border-blue-500 bg-blue-50 shadow-md scale-105"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="w-16 h-20 rounded-lg bg-gray-900 border-2 border-gray-700 shadow-sm mb-3 flex items-center justify-center text-2xl">
                  👕
                </div>
                <span className="font-semibold text-gray-800">ดำ</span>
                {color === "black" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                )}
              </button>
            </div>
          </div>

          {status === "error" && (
            <p className="text-red-500 text-sm text-center">{message}</p>
          )}

          <button
            type="submit"
            disabled={!color || status === "loading"}
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl disabled:opacity-40 active:bg-blue-700 text-base"
          >
            {status === "loading" ? "กำลังบันทึก..." : "บันทึกการโหวต"}
          </button>
        </form>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/results"
          className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl text-sm font-medium"
        >
          📊 ดูผลโหวตรวม
        </Link>
      </div>
    </main>
  );
}
