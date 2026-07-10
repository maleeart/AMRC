import { NextRequest, NextResponse } from "next/server";
import { initRallyDB, insertRally } from "../../../lib/db";

export async function POST(req: NextRequest) {
  const { name, memberId, phone } = await req.json();

  if (!name?.trim() || !memberId?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
  }

  try {
    await initRallyDB();
    await insertRally(name.trim(), memberId.trim(), phone.trim());
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึก" }, { status: 500 });
  }
}
