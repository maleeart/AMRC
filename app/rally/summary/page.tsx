import Link from "next/link";
import { getRally } from "../../../lib/db";

export const revalidate = 0;

export default async function RallySummaryPage() {
  let list: { name: string; member_id: string; phone: string; created_at: Date }[] = [];

  try {
    list = (await getRally()) as typeof list;
  } catch (e) {
    console.error(e);
  }

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🚗</div>
        <h1 className="text-xl font-bold text-gray-800">ผู้ลงทะเบียน Rally</h1>
        <p className="text-gray-500 text-sm">กฟผ. - วังน้ำเขียว</p>
      </div>

      <div className="text-center text-sm text-gray-500 mb-6">
        ลงทะเบียนแล้ว <span className="font-semibold text-gray-800">{list.length}</span> คน
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700 text-sm">รายชื่อผู้ลงทะเบียน</h2>
        </div>
        {list.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">ยังไม่มีผู้ลงทะเบียน</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {list.map((r, i) => (
              <li key={r.member_id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-xs text-gray-400 w-5 text-right">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.member_id}</p>
                </div>
                <a href={`tel:${r.phone}`} className="text-sm text-blue-600 font-medium">
                  {r.phone}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/rally"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium"
        >
          ← กลับหน้าลงทะเบียน
        </Link>
      </div>
    </main>
  );
}
