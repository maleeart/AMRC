import Link from "next/link";
import { getFriendship } from "../../../lib/db";

export const revalidate = 0;

type Registrant = {
  name: string;
  member_id: string;
  callsign: string;
  phone: string;
  option_id: number;
  created_at: Date;
};

const OPTION_LABELS: Record<number, string> = {
  1: "🍽️ ร่วมทานอาหาร",
  2: "🧗‍♂️ อาหาร + กิจกรรม",
  3: "❌ ไม่สะดวกเข้าร่วม",
};

const OPTION_BADGE_CLASSES: Record<number, string> = {
  1: "bg-sky-50 text-sky-700 border-sky-100",
  2: "bg-indigo-50 text-indigo-700 border-indigo-100",
  3: "bg-gray-100 text-gray-500 border-gray-150",
};

export default async function FriendshipSummaryPage() {
  let list: Registrant[] = [];

  try {
    list = (await getFriendship()) as unknown as Registrant[];
  } catch (e) {
    console.error(e);
  }

  // Count summaries
  const diningCount = list.filter((r) => [1, 2].includes(Number(r.option_id))).length;
  const adventureCount = list.filter((r) => Number(r.option_id) === 2).length;
  const cannotAttendCount = list.filter((r) => Number(r.option_id) === 3).length;
  const option1Count = list.filter((r) => Number(r.option_id) === 1).length;
  const option2Count = list.filter((r) => Number(r.option_id) === 2).length;
  const totalCost = (option1Count * 500) + (option2Count * 1000);

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">📻</div>
        <h1 className="text-xl font-bold text-gray-800">ผู้ลงทะเบียน Eyeball Meeting</h1>
        <p className="text-gray-500 text-sm">ชมรมวิทยุสมัครเล่น กฟผ. (สวนลุงหมง)</p>
      </div>

      {/* Summary Stats Card */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-sky-50 border border-sky-100 rounded-xl p-2.5 text-center">
          <p className="text-[10px] text-sky-600 font-semibold">🍽️ ทานอาหาร</p>
          <p className="text-base font-extrabold text-sky-850 mt-0.5">{diningCount} คน</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-2.5 text-center">
          <p className="text-[10px] text-indigo-600 font-semibold">🧗‍♂️ เล่นกิจกรรม</p>
          <p className="text-base font-extrabold text-indigo-850 mt-0.5">{adventureCount} คน</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-center">
          <p className="text-[10px] text-gray-500 font-semibold">❌ ไม่สะดวก</p>
          <p className="text-base font-extrabold text-gray-700 mt-0.5">{cannotAttendCount} คน</p>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mb-6 space-y-1">
        <p>ยอดลงทะเบียนรวมทั้งหมด <span className="font-semibold text-gray-800">{list.length}</span> คน</p>
        <p className="text-xs text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 rounded-xl py-1.5 px-3 inline-block">
          💰 ประมาณการยอดค่าใช้จ่ายรวม: <span className="text-sm font-extrabold text-indigo-800">{totalCost.toLocaleString()}</span> บาท
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-700 text-sm">รายชื่อผู้ลงทะเบียน</h2>
          <span className="text-[10px] text-gray-400">อัปเดตล่าสุดเรียลไทม์</span>
        </div>
        {list.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">ยังไม่มีผู้ลงทะเบียน</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {list.map((r, i) => (
              <li key={r.member_id} className="flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50/50 transition-colors">
                <span className="text-xs text-gray-400 w-5 text-right mt-0.5 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-bold text-gray-850 truncate">{r.name}</p>
                    {r.callsign && (
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded font-mono font-semibold uppercase">
                        {r.callsign}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold ${OPTION_BADGE_CLASSES[Number(r.option_id)] || 'bg-gray-100'}`}>
                      {OPTION_LABELS[Number(r.option_id)] || "ไม่ระบุ"}
                    </span>
                  </div>
                </div>
                <a href={`tel:${r.phone}`} className="text-xs text-blue-600 font-semibold bg-blue-50 border border-blue-100/50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg shrink-0 transition-colors">
                  📞 {r.phone}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/friendship"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all"
        >
          ← กลับหน้าลงทะเบียน
        </Link>
      </div>
    </main>
  );
}
