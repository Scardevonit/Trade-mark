import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(req: Request) {
  const u = await getCurrentUser();
  if (!u) return NextResponse.json({ error: "Login required" }, { status: 401 });
  try {
    const { tradingMode, brokerProvider, displayName } = await req.json();
    const patch: Partial<typeof users.$inferInsert> = { updatedAt: new Date() };
    if (tradingMode && ["live_paper", "live_broker"].includes(tradingMode)) {
      patch.tradingMode = tradingMode;
      if (tradingMode === "live_paper") patch.brokerProvider = null as unknown as string;
    }
    if (brokerProvider && ["alpaca", "coinbase", "kraken", null].includes(brokerProvider)) {
      patch.brokerProvider = brokerProvider as string;
      if (brokerProvider) patch.tradingMode = "live_broker";
    }
    if (displayName && String(displayName).trim()) patch.displayName = String(displayName).trim().slice(0, 60);
    await db.update(users).set(patch).where(eq(users.id, u.id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not update account." }, { status: 500 });
  }
}
