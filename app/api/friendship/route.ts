import { NextRequest, NextResponse } from "next/server";
import { initFriendshipDB, insertFriendship, deleteFriendship } from "../../../lib/db";

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
        const filename = Date.now() + "_" + slipFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");

        const { mkdir, writeFile } = await import("fs/promises");
        const { join } = await import("path");
        const uploadDir = join(process.cwd(), "public", "slips");
        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, filename), buffer);

        slipUrl = "/slips/" + filename;
        paymentStatus = "paid";
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
