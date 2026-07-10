import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
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
          className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-3xl shrink-0">
            🚗
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-800">ลงทะเบียน Rally</h2>
            <p className="text-xs text-gray-500 mt-0.5">กฟผ. - วังน้ำเขียว</p>
          </div>
          <span className="text-gray-300 group-hover:text-green-500 transition-colors text-xl">→</span>
        </Link>
      </div>
    </main>
  );
}
