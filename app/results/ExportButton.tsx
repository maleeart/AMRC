"use client";
export default function ExportButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-xl text-xs font-medium transition-colors no-print"
    >
      🖨️ Export
    </button>
  );
}
