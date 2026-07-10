import { NextResponse } from "next/server";
import { initDB, getResults } from "../../../lib/db";

export async function GET() {
  try {
    await initDB();
    const { votes } = await getResults();
    return NextResponse.json(votes);
  } catch (e) {
    console.error(e);
    return NextResponse.json([], { status: 500 });
  }
}
