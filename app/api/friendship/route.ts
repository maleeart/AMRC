import { NextRequest, NextResponse } from "next/server";
import { initFriendshipDB, insertFriendship, deleteFriendship, getFriendshipByMemberId } from "../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let name = "";
    let memberId = "";
    let callsign = "";
    let phone = "";
    let optionId = 1;
    let paymentStatus = "pending";
    let slipUrl: string | null = null;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      name = body.name || "";
      memberId = body.memberId || "";
      callsign = body.callsign || "";
      phone = body.phone || "";
      optionId = Number(body.optionId);
      paymentStatus = body.paymentStatus || "pending";
      slipUrl = body.slipUrl || null;
    } else {
      const data = await req.formData();
      const isSlipOnly = data.get("mode") === "slip-only";

      if (isSlipOnly) {
        phone = (data.get("phone") as string) || "";
        memberId = phone.trim();

        if (!phone.trim()) {
          return NextResponse.json({ error: "กรุณากรอกเบอร์โทรศัพท์ที่เคยลงทะเบียน" }, { status: 400 });
        }

        const slipFile = data.get("slip") as File | null;
        if (!slipFile || slipFile.size === 0) {
          return NextResponse.json({ error: "กรุณาแนบไฟล์สลิปโอนเงิน" }, { status: 400 });
        }

        await initFriendshipDB();
        const existing = await getFriendshipByMemberId(memberId);
        if (!existing) {
          return NextResponse.json({ error: "ไม่พบข้อมูลการลงทะเบียนสำหรับเบอร์โทรศัพท์นี้" }, { status: 404 });
        }

        const arrayBuffer = await slipFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        slipUrl = `data:${slipFile.type};base64,${base64}`;
        paymentStatus = "paid";

        name = existing.name;
        callsign = existing.callsign || "";
        optionId = existing.option_id;
      } else {
        name = (data.get("name") as string) || "";
        memberId = (data.get("memberId") as string) || "";
        callsign = (data.get("callsign") as string) || "";
        phone = (data.get("phone") as string) || "";
        optionId = Number(data.get("optionId"));
        paymentStatus = (data.get("paymentStatus") as string) || "pending";
        slipUrl = (data.get("slipUrl") as string) || null;

        const slipFile = data.get("slip") as File | null;
        if (slipFile && slipFile.size > 0) {
          const arrayBuffer = await slipFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64 = buffer.toString("base64");
          slipUrl = `data:${slipFile.type};base64,${base64}`;
          paymentStatus = "paid";
        }
      }
    }

    if (!name.trim() || !memberId.trim() || !phone.trim() || ![1, 2, 3].includes(optionId)) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วนหรือไม่ถูกต้อง" }, { status: 400 });
    }

    await initFriendshipDB();
    await insertFriendship(
      name.trim(),
      memberId.trim(),
      callsign.trim(),
      phone.trim(),
      optionId,
      paymentStatus,
      slipUrl
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: `เกิดข้อผิดพลาดในการบันทึก: ${e.message || e}` }, { status: 500 });
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
