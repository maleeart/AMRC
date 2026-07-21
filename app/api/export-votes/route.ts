import ExcelJS from "exceljs";
import { getResults } from "../../../lib/db";

export async function GET() {
  const { votes, summary } = await getResults();

  const wb = new ExcelJS.Workbook();
  wb.creator = "ERAC";
  const ws = wb.addWorksheet("ผลโหวตสีเสื้อ");

  // ── Title row ──────────────────────────────────────────────────
  ws.mergeCells("A1:E1");
  const title = ws.getCell("A1");
  title.value = "ผลโหวตสีเสื้อ — ชมรมวิทยุสมัครเล่น กฟผ.";
  title.font = { bold: true, size: 14 };
  title.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 28;

  // ── Summary row ────────────────────────────────────────────────
  const sumMap: Record<string, number> = {};
  for (const row of summary as { color: string; count: string }[]) {
    sumMap[row.color] = parseInt(row.count);
  }
  const white = sumMap["white"] ?? 0;
  const black = sumMap["black"] ?? 0;
  const total = white + black;

  ws.mergeCells("A2:E2");
  const sumCell = ws.getCell("A2");
  sumCell.value = `เสื้อขาว ${white} คน  |  เสื้อดำ ${black} คน  |  รวม ${total} คน`;
  sumCell.font = { size: 11, color: { argb: "FF555555" } };
  sumCell.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(2).height = 20;

  ws.addRow([]); // spacer

  // ── Header ─────────────────────────────────────────────────────
  const headerRow = ws.addRow(["#", "ชื่อ - สกุล", "รหัสประจำตัว", "สีเสื้อ", "ไซส์"]);
  headerRow.height = 22;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A5F" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FFAAAAAA" } },
    };
  });

  // ── Data rows ─────────────────────────────────────────────────
  (votes as { name: string; member_id: string; color: string; size: string | null }[]).forEach(
    (v, i) => {
      const row = ws.addRow([
        i + 1,
        v.name,
        v.member_id,
        v.color === "white" ? "ขาว" : "ดำ",
        v.size ?? "-",
      ]);
      row.height = 20;
      const isEven = i % 2 === 1;
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
        if (isEven) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F5F5" } };
      });
      // ชื่อ align left
      row.getCell(2).alignment = { horizontal: "left", vertical: "middle" };
      // สีเสื้อ — ไฮไลต์
      const colorCell = row.getCell(4);
      if (v.color === "black") {
        colorCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A1A1A" } };
        colorCell.font = { color: { argb: "FFFFFFFF" } };
      } else {
        colorCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } };
        colorCell.font = { color: { argb: "FF333333" } };
      }
    }
  );

  // ── Column widths ──────────────────────────────────────────────
  ws.columns = [
    { key: "no",   width: 5  },
    { key: "name", width: 30 },
    { key: "id",   width: 18 },
    { key: "color",width: 10 },
    { key: "size", width: 8  },
  ];

  const buf = await wb.xlsx.writeBuffer();
  return new Response(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="vote-results.xlsx"`,
    },
  });
}
