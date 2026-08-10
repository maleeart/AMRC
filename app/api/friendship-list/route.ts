import { NextResponse } from "next/server";
import { initFriendshipDB, getFriendship } from "../../../lib/db";

export async function GET() {
  try {
    await initFriendshipDB();
    const list = await getFriendship();
    return NextResponse.json(list);
  } catch (e) {
    console.error(e);
    return NextResponse.json([], { status: 500 });
  }
}
