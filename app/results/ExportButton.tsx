"use client";
export default function ExportButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-medium"
    >
      🖨️ Export / พิมพ์
    </button>
  );
}
