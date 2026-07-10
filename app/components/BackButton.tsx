import Link from "next/link";

export default function BackButton({ href = "/", label = "หน้าหลัก" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-2 pr-4 py-2 shadow-sm text-sm font-medium text-gray-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 mb-6"
    >
      <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-base leading-none">←</span>
      {label}
    </Link>
  );
}
