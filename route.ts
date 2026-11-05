import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const u = await getCurrentUser();
  if (!u) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: {
      id: u.id,
      email: u.email,
      displayName: u.displayName,
      cashCents: u.cashCents,
      kycStatus: u.kycStatus,
      kycTier: u.kycTier,
      tradingMode: u.tradingMode,
      brokerProvider: u.brokerProvider,
      createdAt: u.createdAt,
    },
  });
}
