import { NextResponse } from "next/server";
import { getLiveQuotes } from "@/lib/prices";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const quotes = await getLiveQuotes();
    return NextResponse.json(
      { quotes, live: quotes[0]?.source !== "offline-guard" },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Price feed unavailable" }, { status: 502 });
  }
}
