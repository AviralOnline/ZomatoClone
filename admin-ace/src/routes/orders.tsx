import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orders, statusLabel, type OrderStatus } from "@/lib/mock-data";
import { Search, Filter, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders — Zamato Partner" }, { name: "description", content: "Live orders and full order history for your restaurant." }] }),
  component: OrdersPage,
});

const tabs: { key: "all" | OrderStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "preparing", label: "Preparing" },
  { key: "on_the_way", label: "On the way" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

function OrdersPage() {
  const [tab, setTab] = useState<"all" | OrderStatus>("all");
  const [q, setQ] = useState("");
  const filtered = orders.filter((o) =>
    (tab === "all" || o.status === tab) &&
    (q === "" || o.id.toLowerCase().includes(q.toLowerCase()) || o.customer.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <AppShell title="Orders" subtitle="Track and manage all customer orders">
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <div className="flex flex-wrap items-center gap-3">
          <TabsList className="flex-wrap">
            {tabs.map((t) => <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>)}
          </TabsList>
          <div className="relative ml-auto w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search order # or customer" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" />Filter</Button>
        </div>
      </Tabs>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {filtered.map((o) => (
          <Card key={o.id} className="border-border/60 shadow-[var(--shadow-card)] transition hover:shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg font-bold">{o.id}</p>
                    <StatusPill status={o.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(o.placedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} · {o.paymentMode}
                  </p>
                </div>
                <p className="font-display text-xl font-bold text-primary">₹{o.total}</p>
              </div>

              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                <p className="font-semibold text-sm">{o.customer}</p>
                <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:gap-4">
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{o.phone}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{o.address}</span>
                </div>
              </div>

              <ul className="mt-3 space-y-1 text-sm">
                {o.items.map((it, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{it.qty}× {it.name}</span>
                    <span className="text-muted-foreground">₹{it.qty * it.price}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {o.status === "pending" && <>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">Accept</Button>
                  <Button size="sm" variant="outline">Reject</Button>
                </>}
                {o.status === "preparing" && <Button size="sm" className="bg-primary hover:bg-primary/90">Mark ready</Button>}
                {o.status === "on_the_way" && <Button size="sm" variant="outline">Track rider</Button>}
                <Button size="sm" variant="ghost">View details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    pending: "bg-warning/15 text-warning-foreground border-warning/30",
    preparing: "bg-chart-3/15 text-chart-3 border-chart-3/30",
    on_the_way: "bg-accent text-accent-foreground border-primary/30",
    delivered: "bg-success/15 text-success border-success/30",
    cancelled: "bg-destructive/10 text-destructive border-destructive/30",
  };
  return <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[status]}`}>{statusLabel[status]}</span>;
}
