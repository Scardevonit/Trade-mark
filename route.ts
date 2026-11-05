import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = String(email ?? "").trim().toLowerCase();
    const rows = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
    if (rows.length === 0)
      return NextResponse.json({ error: "No account found for that email." }, { status: 404 });
    const user = rows[0];
    const ok = await bcrypt.compare(String(password ?? ""), user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    await createSession(user.id);
    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, displayName: user.displayName, cashCents: user.cashCents },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Login failed. Try again." }, { status: 500 });
  }
}
