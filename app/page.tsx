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
      <div className="rounded-2xl overflow-hidden shadow-md mb-8">
        <Image
          src="/header.jpg"
          alt="ชมรมวิทยุสมัครเล่น กฟผ."
          width={800}
          height={500}
          className="w-full h-auto"
          priority
        />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">ชมรมวิทยุสมัครเล่น กฟผ.</h1>
        <p className="text-gray-500 text-sm mt-1">เลือกเมนูที่ต้องการ</p>
      </div>

      {/* Menu */}
      <div className="space-y-4">
        <Link
          href="/vote"
          className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl shrink-0">
            👕
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-800">โหวตสีเสื้อ</h2>
            <p className="text-xs text-gray-500 mt-0.5">เลือกสีและไซส์เสื้อกิจกรรม</p>
          </div>
          <span className="text-gray-300 group-hover:text-blue-500 transition-colors text-xl">→</span>
        </Link>

        <Link
          href="/rally"
          className={`group flex items-center gap-4 bg-white border rounded-2xl p-5 shadow-sm transition-all duration-200 ${
            isFull ? "border-red-100 opacity-75" : "border-gray-100 hover:shadow-md hover:-translate-y-0.5"
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${isFull ? "bg-red-50" : "bg-green-100"}`}>
            🚗
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-800">ลงทะเบียน Rally</h2>
            <p className="text-xs text-gray-500 mt-0.5">กฟผ. - วังน้ำเขียว</p>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
            isFull
              ? "bg-red-100 text-red-500"
              : slotsLeft <= 2
              ? "bg-orange-100 text-orange-600"
              : "bg-green-100 text-green-700"
          }`}>
            {isFull ? "เต็มแล้ว" : `ว่าง ${slotsLeft}/${RALLY_LIMIT}`}
          </span>
        </Link>
      </div>

      <div className="mt-10 text-center">
        <Link href="/admin" className="text-xs text-gray-300 hover:text-gray-400 transition-colors">
          ⚙️ ผู้ดูแลระบบ
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-0.5">
        <p className="text-[11px] text-gray-300 font-medium tracking-wide">ผู้ดูแลระบบ</p>
        <p className="text-[12px] text-gray-400 font-semibold">นายตวงเพชร ชัยยานนท์</p>
        <p className="text-[10px] text-gray-300">วศ.4 &nbsp;·&nbsp; หบอว-ธ. &nbsp;·&nbsp; กบห-ธ. &nbsp;·&nbsp; ชธธ.</p>
      </div>
    </main>
  );
}
