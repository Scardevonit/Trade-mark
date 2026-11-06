import Link from "next/link";
import { getLiveQuotes } from "@/lib/prices";
import { usd, pct } from "@/lib/format";

export const dynamic = "force-dynamic";

function LandingTradeCard({ quotes }: { quotes: Awaited<ReturnType<typeof getLiveQuotes>> }) {
  const btc = quotes.find((q) => q.symbol === "BTC") ?? quotes[0];
  const fee = (100 * 0.0025).toFixed(2);
  const qty = btc ? (100 / btc.priceUsd).toFixed(6) : "0";
  return (
    <div className="card overflow-hidden">
      <div className="flex items-start justify-between px-5 py-4 sm:px-7">
        <div>
          <p className="text-xl font-extrabold">Market watch</p>
          <p className="text-sm text-slate-400">Live prices · USD · {btc?.source ?? "coinbase"}</p>
        </div>
        <p className="eyebrow flex items-center gap-2 pt-1 text-[13px] text-[#2ee6a8]">
          <span className="live-dot inline-block h-2 w-2 rounded-full bg-[#2ee6a8]" /> LIVE MARKET
        </p>
      </div>
      <div className="space-y-3 border-t border-white/10 px-5 py-5 sm:px-7">
        {quotes.slice(0, 5).map((q) => (
          <div key={q.symbol} className="flex items-center justify-between text-[15px]">
            <div className="font-bold">
              {q.name} <span className="text-slate-400">· {q.symbol}</span>
            </div>
            <div className="text-right">
              <div className="num font-extrabold">{usd(q.priceUsd)}</div>
              <div className={`num text-xs font-bold ${q.change24hPct >= 0 ? "text-[#2ee6a8]" : "text-rose-300"}`}>
                {pct(q.change24hPct)} 24h
              </div>
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-white/10 bg-black/30 p-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="btn-mint py-3 text-center text-lg">Buy</div>
            <div className="py-3 text-center text-lg font-bold text-slate-400">Sell</div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-slate-400">Amount in USD</p>
          <div className="input px-4 py-4 text-lg">100</div>
        </div>

        <div className="space-y-2 pt-1 text-[15px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Estimated quantity</span>
            <b className="num">{qty} BTC</b>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Live fee (0.25%)</span>
            <b className="num">${fee}</b>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Estimated total</span>
            <b className="num">${(100 + Number(fee)).toFixed(2)}</b>
          </div>
        </div>

        <Link href="/app" className="btn-primary block py-4 text-center text-lg">
          Trade live now ↗
        </Link>
        <p className="text-center text-xs text-slate-500">
          Live reference price {btc ? usd(btc.priceUsd) : ""} · updates every ~8s · real ledger, no paper simulation
        </p>
      </div>
    </div>
  );
}

export default async function Landing() {
  const quotes = await getLiveQuotes().catch(() => []);
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <p className="text-[28px] font-extrabold tracking-tight">
          tidemark<span className="text-[#7aa8ff]">.</span>
        </p>
        <Link href="/app" className="btn-primary px-5 py-3 text-[15px]">
          Launch app ↗
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="eyebrow text-[13px] text-[#2ee6a8] sm:text-sm">CRYPTO, MADE CLEARER · LIVE</p>
          <h1 className="mt-3 text-[44px] font-extrabold leading-[1.02] tracking-tight sm:text-[68px]">
            Your next move.
            <br />
            <span className="text-[#7aa8ff]">Made with confidence.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-slate-300 sm:text-[21px]">
            Explore digital assets, understand your order before you place it, and trade live in a
            clean, simple experience — real accounts, real ledger, live prices.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/app" className="btn-primary px-7 py-4 text-center text-[17px]">
              Trade live now
            </Link>
            <Link href="/go-live" className="btn-ghost px-7 py-4 text-center text-[17px] font-bold">
              How live works
            </Link>
          </div>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-400">
            Live experience. Market values stream from Coinbase Exchange. Orders update your real
            Tidemark ledger; connect Alpaca for regulated external settlement. No demo funds.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Live prices", "Coinbase + Kraken feeds, 8s refresh"],
              ["Real ledger", "Cash, holdings, fees in Postgres"],
              ["Broker routing", "Alpaca / Coinbase / Kraken ready"],
            ].map(([t, d]) => (
              <div key={t} className="card p-4">
                <p className="font-extrabold">{t}</p>
                <p className="mt-1 text-[13px] leading-snug text-slate-400">{d}</p>
              </div>
            ))}
          </div>
        </div>

        <LandingTradeCard quotes={quotes} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="card grid gap-6 p-6 sm:p-8 lg:grid-cols-4">
          <div>
            <p className="eyebrow text-xs text-[#2ee6a8]">01 · ACCOUNT</p>
            <p className="mt-2 font-extrabold">Create your live account</p>
            <p className="mt-1 text-sm text-slate-400">Email + password, instant starter ledger. Verify ID to raise limits.</p>
          </div>
          <div>
            <p className="eyebrow text-xs text-[#2ee6a8]">02 · FUND</p>
            <p className="mt-2 font-extrabold">Deposit USD</p>
            <p className="mt-1 text-sm text-slate-400">ACH / card rails. Add STRIPE_SECRET_KEY for real card settlement.</p>
          </div>
          <div>
            <p className="eyebrow text-xs text-[#2ee6a8]">03 · TRADE</p>
            <p className="mt-2 font-extrabold">Buy & sell at live prices</p>
            <p className="mt-1 text-sm text-slate-400">See fee + total pre-trade. Market & limit orders supported.</p>
          </div>
          <div>
            <p className="eyebrow text-xs text-[#2ee6a8]">04 · GO REGULATED</p>
            <p className="mt-2 font-extrabold">Connect Alpaca</p>
            <p className="mt-1 text-sm text-slate-400">Paste keys in Settings — orders route to your licensed brokerage.</p>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 pb-12 text-[13px] leading-relaxed text-slate-500">
        <div className="flex flex-wrap gap-4 border-t border-white/10 pt-6">
          <Link href="/go-live" className="underline">Go-live checklist</Link>
          <Link href="/compliance" className="underline">Risk, Terms & Privacy</Link>
          <Link href="/learn" className="underline">Learn</Link>
          <Link href="/settings" className="underline">Connect broker</Link>
        </div>
        <p className="mt-4">
          Tidemark is software, not a licensed broker-dealer, bank, or money transmitter. To custody
          client funds or guarantee settlement you must operate through a licensed partner (e.g.
          Alpaca, Coinbase) and complete KYC/AML, registrations, and legal review in your
          jurisdiction. See Go-live files included in this repo.
        </p>
      </footer>
    </main>
  );
}
