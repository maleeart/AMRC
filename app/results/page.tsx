import Image from "next/image";
import Link from "next/link";
import { getResults } from "../../lib/db";
import ExportButton from "./ExportButton";

export const revalidate = 0;

export default async function ResultsPage() {
  let votes: { name: string; member_id: string; color: string; size: string | null; created_at: Date }[] = [];
  let whiteCount = 0;
  let blackCount = 0;

  try {
    const { votes: v, summary } = await getResults();
    votes = v as typeof votes;
    for (const row of summary as { color: string; count: string }[]) {
      if (row.color === "white") whiteCount = parseInt(row.count);
      if (row.color === "black") blackCount = parseInt(row.count);
    }
  } catch (e) {
    console.error(e);
  }

  const total = whiteCount + blackCount;

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">📊 ผลโหวตสีเสื้อ</h1>
          <p className="text-gray-500 text-sm">ชมรมวิทยุสมัครเล่น กฟผ.</p>
        </div>
        <ExportButton />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-center">
          <Image src="/demo/shirt-white.svg" alt="เสื้อขาว" width={72} height={90} className="mx-auto mb-2 drop-shadow-sm" />
          <div className="text-3xl font-bold text-gray-800">{whiteCount} คน</div>
          <div className="text-sm text-gray-500 mt-1">เสื้อขาว</div>
          {total > 0 && (
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gray-400 rounded-full" style={{ width: `${(whiteCount / total) * 100}%` }} />
            </div>
          )}
          <div className="text-xs text-gray-400 mt-1">
            {total > 0 ? `${Math.round((whiteCount / total) * 100)}%` : "0%"}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-center">
          <Image src="/demo/shirt-black.svg" alt="เสื้อดำ" width={72} height={90} className="mx-auto mb-2 drop-shadow-sm" />
          <div className="text-3xl font-bold text-gray-800">{blackCount} คน</div>
          <div className="text-sm text-gray-500 mt-1">เสื้อดำ</div>
          {total > 0 && (
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gray-700 rounded-full" style={{ width: `${(blackCount / total) * 100}%` }} />
            </div>
          )}
          <div className="text-xs text-gray-400 mt-1">
            {total > 0 ? `${Math.round((blackCount / total) * 100)}%` : "0%"}
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mb-6">
        ผู้โหวตทั้งหมด <span className="font-semibold text-gray-800">{total}</span> คน
      </div>

      {/* Voter list — 2 columns */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700 text-sm">รายชื่อผู้โหวต</h2>
        </div>
        {votes.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">ยังไม่มีผู้โหวต</p>
        ) : (
          <div className="grid grid-cols-2 divide-x divide-gray-50">
            {votes.map((v) => (
              <div key={v.member_id} className="flex items-center justify-between px-3 py-2.5 border-b border-gray-50">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{v.name}</p>
                  <p className="text-[10px] text-gray-400">{v.member_id}</p>
                </div>
                <div className="flex items-center gap-1 ml-1 shrink-0">
                  {v.size && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {v.size}
                    </span>
                  )}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    v.color === "white" ? "bg-gray-100 text-gray-700" : "bg-black text-white"
                  }`}>
                    {v.color === "white" ? "ขาว" : "ดำ"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 text-center no-print">
        <Link href="/vote" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium">
          ← กลับหน้าโหวต
        </Link>
      </div>
    </main>
  );
}
