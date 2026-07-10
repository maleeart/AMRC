import Link from "next/link";
import { getResults } from "@/lib/db";

export const revalidate = 0;

export default async function ResultsPage() {
  let votes: { name: string; member_id: string; color: string; created_at: Date }[] = [];
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
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">📊</div>
        <h1 className="text-xl font-bold text-gray-800">ผลโหวตสีเสื้อ</h1>
        <p className="text-gray-500 text-sm">ชมรมวิทยุสมัครเล่น AMRC</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-gray-800">{whiteCount}</div>
          <div className="text-sm text-gray-500 mt-1">เสื้อขาว</div>
          {total > 0 && (
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 rounded-full"
                style={{ width: `${(whiteCount / total) * 100}%` }}
              />
            </div>
          )}
          <div className="text-xs text-gray-400 mt-1">
            {total > 0 ? `${Math.round((whiteCount / total) * 100)}%` : "0%"}
          </div>
        </div>

        <div className="bg-gray-900 border-2 border-gray-700 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-white">{blackCount}</div>
          <div className="text-sm text-gray-400 mt-1">เสื้อดำ</div>
          {total > 0 && (
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-300 rounded-full"
                style={{ width: `${(blackCount / total) * 100}%` }}
              />
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {total > 0 ? `${Math.round((blackCount / total) * 100)}%` : "0%"}
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mb-6">
        ผู้โหวตทั้งหมด <span className="font-semibold text-gray-800">{total}</span> คน
      </div>

      {/* Voter list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700 text-sm">รายชื่อผู้โหวต</h2>
        </div>
        {votes.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">ยังไม่มีผู้โหวต</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {votes.map((v) => (
              <li key={v.member_id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{v.name}</p>
                  <p className="text-xs text-gray-400">{v.member_id}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    v.color === "white"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {v.color === "white" ? "ขาว" : "ดำ"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium"
        >
          ← กลับหน้าโหวต
        </Link>
      </div>
    </main>
  );
}
