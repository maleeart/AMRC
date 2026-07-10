import { NextResponse } from "next/server";
import { initRallyDB, getRally } from "../../../lib/db";

export async function GET() {
  try {
    await initRallyDB();
    const list = await getRally();
    return NextResponse.json(list);
  } catch (e) {
    console.error(e);
    return NextResponse.json([], { status: 500 });
  }
}
