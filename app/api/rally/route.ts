import { NextRequest, NextResponse } from "next/server";
import { initRallyDB, insertRally, getRallyCount, isRallyMember, deleteRally } from "../../../lib/db";

const RALLY_LIMIT = 5;

export async function POST(req: NextRequest) {
  const { name, memberId, phone } = await req.json();

  if (!name?.trim() || !memberId?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
  }

  try {
    await initRallyDB();

    const isExisting = await isRallyMember(memberId.trim());
    if (!isExisting) {
      const count = await getRallyCount();
      if (count >= RALLY_LIMIT) {
        return NextResponse.json(
          { error: `ขออภัย มีผู้ลงทะเบียนครบ ${RALLY_LIMIT} คนแล้ว` },
          { status: 409 }
        );
      }
    }

    await insertRally(name.trim(), memberId.trim(), phone.trim());
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
    await deleteRally(memberId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
