import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { transactions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, displayName } = await req.json();
    const cleanEmail = String(email ?? "").trim().toLowerCase();
    const pw = String(password ?? "");
    const name = String(displayName ?? "Trader").trim().slice(0, 60) || "Trader";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail))
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    if (pw.length < 8)
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

    const existing = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
    if (existing.length > 0)
      return NextResponse.json({ error: "An account with that email already exists. Log in instead." }, { status: 409 });

    const hash = await bcrypt.hash(pw, 12);
    const inserted = await db
      .insert(users)
      .values({ email: cleanEmail, passwordHash: hash, displayName: name, cashCents: 100000 })
      .returning();
    const user = inserted[0];
    await db.insert(transactions).values({
      userId: user.id,
      kind: "deposit",
      amountCents: 100000,
      status: "completed",
      method: "starter_credit",
      reference: "Welcome starter balance — live ledger",
    });
    await createSession(user.id);
    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, displayName: user.displayName, cashCents: user.cashCents },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not create account. Try again." }, { status: 500 });
  }
}
