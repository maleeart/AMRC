"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RallyPage() {
  const [name, setName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/rally", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, memberId, phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("ลงทะเบียนเรียบร้อยแล้ว!");
        setName("");
        setMemberId("");
        setPhone("");
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
      {/* Banner */}
      <div className="rounded-2xl overflow-hidden mb-5 shadow-sm">
        <Image
          src="/rally.jpg"
          alt="Rally กฟผ.-วังน้ำเขียว"
          width={800}
          height={500}
          className="w-full h-auto"
          priority
        />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">ลงทะเบียนเข้าร่วมกิจกรรม</h1>
        <p className="text-blue-600 font-semibold mt-1">Rally กฟผ. - วังน้ำเขียว</p>
        <p className="text-gray-500 text-sm mt-1">ชมรมวิทยุสมัครเล่น กฟผ.</p>
      </div>

      {status === "success" ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-green-600 font-semibold text-lg">{message}</p>
          <button onClick={() => setStatus("idle")} className="mt-6 text-blue-600 underline text-sm">
            ลงทะเบียนเพิ่ม
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เบอร์โทรศัพท์ <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="กรอกเบอร์โทรศัพท์"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {status === "error" && <p className="text-red-500 text-sm text-center">{message}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl disabled:opacity-40 active:bg-blue-700 text-base"
          >
            {status === "loading" ? "กำลังบันทึก..." : "ลงทะเบียนเข้าร่วม"}
          </button>
        </form>
      )}

      <div className="mt-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl text-sm font-medium">
          ← กลับหน้าหลัก
        </Link>
      </div>
    </main>
  );
}
