"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BackButton from "../components/BackButton";

export default function FriendshipForm() {
  const [name, setName] = useState("");
  const [callsign, setCallsign] = useState("");
  const [phone, setPhone] = useState("");
  const [optionId, setOptionId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (optionId === null) {
      setStatus("error");
      setMessage("กรุณาเลือกรูปแบบการเข้าร่วมกิจกรรม");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/friendship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, memberId: phone.trim(), callsign, phone, optionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("ลงทะเบียนสำเร็จเรียบร้อยแล้ว!");
        setName("");
        setCallsign("");
        setPhone("");
        setOptionId(null);
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

      {/* Title Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Eyeball Meeting
        </h1>
        <p className="text-gray-500 text-xs mt-1 font-medium tracking-wide">
          กิจกรรมสานสัมพันธ์ชมรมวิทยุสมัครเล่น กฟผ. (สวนลุงหมง)
        </p>
      </div>

      {/* Banner / Promotion Images Section */}
      <div className="space-y-4 mb-6">
        {/* Date and Place Info Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 space-y-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <span className="text-lg">📅</span>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase">วันและเวลา</p>
              <p className="text-sm font-bold text-gray-800">วันเสาร์ที่ 12 กันยายน 2569</p>
              <p className="text-xs text-gray-600">ตั้งแต่เวลา 12:00 น. เป็นต้นไป</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-2 border-t border-blue-100/50">
            <span className="text-lg">📍</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-semibold uppercase">สถานที่นัดพบ</p>
              <p className="text-sm font-bold text-gray-800">พิกัดจุดนัดพบกิจกรรม</p>
              <a
                href="https://maps.app.goo.gl/E1Y5wh1QweEfLgrk6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:underline mt-1 bg-white px-2.5 py-1.5 rounded-lg border border-indigo-100"
              >
                🗺️ ดูแผนที่นำทาง
              </a>
            </div>
          </div>
        </div>

        {/* Promo Images Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPreviewImg("/eat.jpg")}
            className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm hover:shadow transition-shadow group text-left cursor-zoom-in"
          >
            <div className="relative h-28 w-full overflow-hidden bg-gray-100">
              <Image
                src="/eat.jpg"
                alt="กิจกรรมรับประทานอาหาร"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <h3 className="font-bold text-xs text-gray-800 flex items-center justify-between">
                <span>🍽️ มื้อพิเศษ</span>
                <span className="text-[9px] text-indigo-500 font-normal group-hover:underline">🔍 ดูรูปใหญ่</span>
              </h3>
              <p className="text-[10px] text-gray-500 mt-1 leading-snug">
                รับประทานอาหารอร่อยเลิศรส พูดคุยแลกเปลี่ยนประสบการณ์อบอุ่น
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPreviewImg("/adventure.jpg")}
            className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm hover:shadow transition-shadow group text-left cursor-zoom-in"
          >
            <div className="relative h-28 w-full overflow-hidden bg-gray-100">
              <Image
                src="/adventure.jpg"
                alt="กิจกรรม Adventure"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <h3 className="font-bold text-xs text-gray-800 flex items-center justify-between">
                <span>🧗‍♂️ แอดเวนเจอร์</span>
                <span className="text-[9px] text-indigo-500 font-normal group-hover:underline">🔍 ดูรูปใหญ่</span>
              </h3>
              <p className="text-[10px] text-gray-500 mt-1 leading-snug">
                ท้าความมันส์กับกิจกรรมผจญภัย สร้างความสามัคคีร่วมกัน
              </p>
            </div>
          </button>
        </div>
      </div>

      {status === "success" ? (
        <div className="text-center py-10 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="text-5xl mb-4">🎉</div>
          <p className="text-indigo-600 font-bold text-lg">{message}</p>
          <p className="text-gray-400 text-xs mt-1">ขอบคุณสำหรับข้อมูลการลงทะเบียน</p>
          <div className="flex flex-col gap-2 px-6 mt-6">
            <button
              onClick={() => setStatus("idle")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              ลงทะเบียนเพิ่มเติม
            </button>
            <Link
              href="/friendship/summary"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              👥 ดูรายชื่อผู้ลงทะเบียนทั้งหมด
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              ชื่อ - สกุล <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="กรอกชื่อและนามสกุลของคุณ"
              className="w-full border border-gray-250 bg-gray-50/20 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              นามเรียกขาน (ถ้ามี)
            </label>
            <input
              type="text"
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              placeholder="เช่น HS0XXX"
              className="w-full border border-gray-250 bg-gray-50/20 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              เบอร์โทรศัพท์ <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="กรอกเบอร์โทรศัพท์ติดต่อ"
              className="w-full border border-gray-250 bg-gray-50/20 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              รูปแบบการเข้าร่วมกิจกรรม <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {/* Option 1 */}
              <button
                type="button"
                onClick={() => setOptionId(1)}
                className={`w-full text-left rounded-xl border-2 p-3.5 transition-all flex items-start gap-3 relative ${
                  optionId === 1
                    ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">🍽️</span>
                <div>
                  <h4 className="font-bold text-xs text-gray-800">ร่วมทานอาหาร (คนละ 500 บาท)</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">ทานอาหารเลิศรส สานความอบอุ่นภายในชมรม</p>
                </div>
                {optionId === 1 && (
                  <div className="absolute top-2 right-2 w-4.5 h-4.5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                )}
              </button>

              {/* Option 2 */}
              <button
                type="button"
                onClick={() => setOptionId(2)}
                className={`w-full text-left rounded-xl border-2 p-3.5 transition-all flex items-start gap-3 relative ${
                  optionId === 2
                    ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">🧗‍♂️</span>
                <div>
                  <h4 className="font-bold text-xs text-gray-800">ร่วมทานอาหาร + เล่นกิจกรรม Adventure (คนละ 500 บาท)</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">ทานอาหาร และผจญภัยท้าทายสนุกเต็มพิกัด</p>
                </div>
                {optionId === 2 && (
                  <div className="absolute top-2 right-2 w-4.5 h-4.5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                )}
              </button>

              {/* Option 3 */}
              <button
                type="button"
                onClick={() => setOptionId(3)}
                className={`w-full text-left rounded-xl border-2 p-3.5 transition-all flex items-start gap-3 relative ${
                  optionId === 3
                    ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">❌</span>
                <div>
                  <h4 className="font-bold text-xs text-gray-800">ไม่สะดวกเข้าร่วม</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">ส่งกำลังใจร่วมงานทางไกลในรอบนี้</p>
                </div>
                {optionId === 3 && (
                  <div className="absolute top-2 right-2 w-4.5 h-4.5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                )}
              </button>
            </div>
          </div>

          {status === "error" && (
            <p className="text-red-500 text-xs text-center font-medium">{message}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-40 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-sm shadow-sm transition-all"
          >
            {status === "loading" ? "กำลังลงทะเบียน..." : "ลงทะเบียนเข้าร่วม"}
          </button>
        </form>
      )}

      {/* Button to check user list */}
      <div className="mt-6 text-center">
        <Link
          href="/friendship/summary"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-indigo-600 bg-white border border-gray-200 hover:border-indigo-200 shadow-sm rounded-xl px-4 py-2.5 transition-colors"
        >
          👥 ดูรายชื่อผู้ลงทะเบียน ({status === "success" ? "อัปเดตแล้ว" : "รายชื่อทั้งหมด"})
        </Link>
      </div>
      {/* Image Preview Modal overlay */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-[fadeIn_0.2s_ease]"
          onClick={() => setPreviewImg(null)}
        >
          <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-gray-950" onClick={(e) => e.stopPropagation()}>
            <Image
              src={previewImg}
              alt="กิจกรรมขนาดใหญ่"
              fill
              className="object-contain p-2"
              priority
            />
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center font-bold text-sm shadow transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
