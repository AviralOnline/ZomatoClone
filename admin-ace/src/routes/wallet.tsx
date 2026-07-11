import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { walletBalance, walletPending, walletTxns, monthlyRevenue } from "@/lib/mock-data";
import { ArrowDownLeft, ArrowUpRight, Wallet as WalletIcon, Download, Landmark } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "Wallet & Payouts — Zamato Partner" }, { name: "description", content: "Earnings, payouts and transaction history." }] }),
  component: WalletPage,
});

function WalletPage() {
  return (
    <AppShell title="Wallet & Payouts" subtitle="Your earnings, settlements and transactions">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 overflow-hidden border-none text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <WalletIcon className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Available balance</span>
                </div>
                <p className="mt-3 font-display text-5xl font-bold">₹{walletBalance.toLocaleString()}</p>
                <p className="mt-1 text-sm text-primary-foreground/80">Pending settlement: ₹{walletPending.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-white/15 px-3 py-2 text-xs font-medium backdrop-blur">HDFC ****4521</div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90"><Landmark className="mr-2 h-4 w-4" />Withdraw to bank</Button>
              <Button variant="outline" className="border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20"><Download className="mr-2 h-4 w-4" />Statement</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">This month</p>
            <p className="mt-2 font-display text-3xl font-bold">₹2,58,420</p>
            <p className="mt-1 text-xs text-success">+12.4% vs last month</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-muted-foreground">Payouts</p>
                <p className="mt-1 font-display font-bold">₹1,89,000</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-muted-foreground">Fees</p>
                <p className="mt-1 font-display font-bold">₹18,240</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border/60 shadow-[var(--shadow-card)]">
        <CardHeader><CardTitle className="font-display">Earnings trend</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-primary)" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="mt-6 border-border/60 shadow-[var(--shadow-card)]">
        <CardHeader><CardTitle className="font-display">Recent transactions</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {walletTxns.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-6 py-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.type === "credit" ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {t.type === "credit" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{t.desc}</p>
                  <p className="text-xs text-muted-foreground">{t.date}</p>
                </div>
                <p className={`font-display font-bold ${t.type === "credit" ? "text-success" : "text-foreground"}`}>
                  {t.type === "credit" ? "+" : "−"}₹{t.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
