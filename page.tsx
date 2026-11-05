"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/chrome";
import { usd, timeAgo } from "@/lib/format";

type Order = { id: string; symbol: string; side: string; orderType: string; qty: string; status: string; venue: string; executedPriceUsd: string | null; feeUsd: string; totalUsd: string | null; note: string | null; createdAt: string };
type Tx = { id: string; kind: string; amountCents: number; status: string; method: string | null; reference: string | null; createdAt: string };

export default function Activity() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [tab, setTab] = useState<"orders" | "cash">("orders");

  useEffect(() => {
    fetch("/api/portfolio").then(async (r) => {
      if (r.status === 401) return router.push("/signup?next=/activity");
      const j = await r.json();
      setOrders(j.orders ?? []);
      setTxs(j.transactions ?? []);
    });
  }, [router]);

  async function cancel(id: string) {
    await fetch(`/api/orders?id=${id}`, { method: "DELETE" });
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status: "cancelled" } : x)));
  }

  return (
    <main className="min-h-screen pb-16">
      <TopNav />
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <h1 className="text-4xl font-extrabold">Activity</h1>
        <p className="mt-1 text-sm text-slate-400">Every fill, fee, deposit and routing note — your audit trail.</p>
        <div className="mt-4 flex gap-2">
          {(["orders", "cash"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-extrabold capitalize ${tab === t ? "bg-[#7aa8ff] text-[#0a1430]" : "bg-white/5 text-slate-300"}`}>{t === "orders" ? "Orders" : "Cash movements"}</button>
          ))}
        </div>
        {tab === "orders" ? (
          <div className="mt-3 space-y-2">
            {orders.length === 0 && <div className="card p-6 text-sm text-slate-500">No orders yet. <a href="/app" className="underline text-[#7aa8ff]">Place your first live order →</a></div>}
            {orders.map((o) => (
              <div key={o.id} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-extrabold">
                    <span className={o.side === "buy" ? "text-[#2ee6a8]" : "text-rose-300"}>{o.side.toUpperCase()}</span> {o.qty} {o.symbol}
                    <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs">{o.status} · {o.venue} · {o.orderType}</span>
                  </p>
                  <p className="num font-extrabold">{o.totalUsd ? usd(Number(o.totalUsd)) : "—"}</p>
                </div>
                <p className="mt-1 text-[13px] text-slate-400">
                  {o.executedPriceUsd ? `Filled @ ${usd(Number(o.executedPriceUsd))} · fee ${usd(Number(o.feeUsd))} · ` : ""}{timeAgo(o.createdAt)}
                </p>
                {o.note && <p className="mt-1 text-[13px] text-slate-500">{o.note}</p>}
                {o.status === "working" && (
                  <button onClick={() => cancel(o.id)} className="btn-ghost mt-2 px-3 py-1.5 text-xs font-bold">Cancel working order</button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {txs.length === 0 && <div className="card p-6 text-sm text-slate-500">No cash movements yet.</div>}
            {txs.map((t) => (
              <div key={t.id} className="card flex items-center justify-between p-4">
                <div>
                  <p className="font-extrabold capitalize">{t.kind} <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-normal">{t.status}</span></p>
                  <p className="text-[13px] text-slate-500">{t.reference ?? t.method ?? ""} · {timeAgo(t.createdAt)}</p>
                </div>
                <p className={`num font-extrabold ${t.amountCents >= 0 ? "text-[#2ee6a8]" : ""}`}>{t.amountCents >= 0 ? "+" : ""}{usd(t.amountCents / 100)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
