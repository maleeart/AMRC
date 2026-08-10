import Image from "next/image";
import Link from "next/link";
import { getRallyCount, initRallyDB } from "../lib/db";

export const revalidate = 0;

const RALLY_LIMIT = 5;

export default async function HomePage() {
  let slotsLeft = RALLY_LIMIT;
  try {
    await initRallyDB();
    slotsLeft = RALLY_LIMIT - (await getRallyCount());
  } catch {}

  const isFull = slotsLeft <= 0;

  return (
    <main className="max-w-md mx-auto px-4 py-8 animate-[fadeIn_0.5s_ease]">
      {/* Header image */}
      <div className="rounded-2xl overflow-hidden shadow-md mb-6">
        <Image
          src="/header.jpg"
          alt="ชมรมวิทยุสมัครเล่น กฟผ."
          width={800}
          height={500}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Brand row */}
      <div className="flex items-center gap-4 mb-8 px-1">
        <Image
          src="/icon.svg"
          alt="ERAC Logo"
          width={64}
          height={64}
          className="rounded-2xl shadow-sm shrink-0"
        />
        <div>
          <h1 className="text-xl font-bold text-gray-800 leading-tight">ชมรมวิทยุสมัครเล่น กฟผ.</h1>
          <p className="text-xs text-gray-400 mt-0.5 tracking-wide">EGAT Radio Amateur Club · 144.700 MHz</p>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-4">
        {/* Active: Wave of Friendship */}
        <Link
          href="/friendship"
          className="group flex items-center gap-4 bg-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
        >
          {/* Subtle blue accent glow */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400"></div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-3xl text-white shrink-0 shadow-sm">
            📻
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-850">Ham EGAT: Wave of Friendship</h2>
              <span className="animate-pulse inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
            </div>
            <p className="text-xs text-blue-600 font-medium mt-0.5">ลงทะเบียนร่วมกิจกรรมสานสัมพันธ์ (สวนลงหมง)</p>
          </div>
          <span className="text-gray-300 group-hover:text-blue-500 transition-colors text-xl">→</span>
        </Link>

        {/* Dropdown for past activities */}
        <details className="group border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-350">
          <summary className="flex items-center justify-between cursor-pointer p-4 select-none font-bold text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            <span className="flex items-center gap-2">⏱️ กิจกรรมที่ผ่านมา (สิ้นสุดกำหนดแล้ว)</span>
            <span className="text-gray-400 group-open:rotate-180 transition-transform duration-250 text-xs">▼</span>
          </summary>
          <div className="p-4 border-t border-gray-100 bg-gray-50/70 space-y-3 pointer-events-none select-none">
            {/* Disabled Vote Card */}
            <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 opacity-55 grayscale">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">
                👕
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-700 text-sm">โหวตสีเสื้อ</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">สิ้นสุดเวลากิจกรรม</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">ปิดโหวต</span>
            </div>

            {/* Disabled Rally Card */}
            <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 opacity-55 grayscale">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">
                🚗
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-700 text-sm">ลงทะเบียน Rally</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">กฟผ. - วังน้ำเขียว</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">สิ้นสุดแล้ว</span>
            </div>
          </div>
        </details>
      </div>

      <div className="mt-10 text-center">
        <Link href="/admin" className="text-xs text-gray-300 hover:text-gray-400 transition-colors">
          ⚙️ จัดการข้อมูล
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-0.5">
        <p className="text-[10px] text-gray-300 tracking-wide">นายตวงเพชร ชัยยานนท์</p>
        <p className="text-[9px] text-gray-300">วศ.4 &nbsp;·&nbsp; หบอว-ธ. &nbsp;·&nbsp; กบห-ธ. &nbsp;·&nbsp; ชธธ.</p>
      </div>
    </main>
  );
}
