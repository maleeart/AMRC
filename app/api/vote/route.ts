import { NextRequest, NextResponse } from "next/server";
import { initDB, insertVote } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name, memberId, color } = await req.json();

  if (!name?.trim() || !memberId?.trim() || !["white", "black"].includes(color)) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
  }

  try {
    await initDB();
    await insertVote(name.trim(), memberId.trim(), color);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึก" }, { status: 500 });
  }
}
