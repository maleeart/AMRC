import { NextRequest, NextResponse } from "next/server";
import { initDB, insertVote, deleteVote } from "../../../lib/db";

export async function POST(req: NextRequest) {
  const { name, memberId, color, size } = await req.json();

  if (!name?.trim() || !memberId?.trim() || !["white", "black"].includes(color) || !size?.trim()) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
  }

  try {
    await initDB();
    await insertVote(name.trim(), memberId.trim(), color, size.trim());
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึก" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { memberId } = await req.json();
  if (!memberId) return NextResponse.json({ error: "ไม่พบรหัส" }, { status: 400 });
  try {
    await deleteVote(memberId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
