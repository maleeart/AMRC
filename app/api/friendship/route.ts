import { NextRequest, NextResponse } from "next/server";
import { initFriendshipDB, insertFriendship, deleteFriendship } from "../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, memberId, callsign, phone, optionId } = await req.json();

    if (!name?.trim() || !memberId?.trim() || !phone?.trim() || ![1, 2, 3].includes(Number(optionId))) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วนหรือไม่ถูกต้อง" }, { status: 400 });
    }

    await initFriendshipDB();
    await insertFriendship(
      name.trim(),
      memberId.trim(),
      callsign?.trim() || "",
      phone.trim(),
      Number(optionId)
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึก" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { memberId } = await req.json();
    if (!memberId) {
      return NextResponse.json({ error: "ไม่พบรหัส" }, { status: 400 });
    }

    await initFriendshipDB();
    await deleteFriendship(memberId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
