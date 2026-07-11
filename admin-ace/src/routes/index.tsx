import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  monthlyRevenue, weeklyOrders, categoryMix, orders, products, statusLabel,
} from "@/lib/mock-data";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, IndianRupee, ShoppingBag, Users, Star, ArrowUpRight, Download } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Zamato Partner" },
      { name: "description", content: "Monthly revenue, orders, and performance overview for your restaurant." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Revenue (This Month)", value: "₹2,58,420", delta: "+12.4%", icon: IndianRupee, tone: "text-primary" },
  { label: "Orders (This Month)", value: "1,082", delta: "+8.1%", icon: ShoppingBag, tone: "text-chart-3" },
  { label: "New Customers", value: "214", delta: "+18.7%", icon: Users, tone: "text-success" },
  { label: "Avg. Rating", value: "4.6", delta: "+0.2", icon: Star, tone: "text-warning" },
];

const chartColors = ["hsl(var(--chart-1))", "var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function Dashboard() {
  const recent = orders.slice(0, 6);
  const top = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

  return (
    <AppShell
      title="Dashboard"
      subtitle="Welcome back, Spice Palace 👋"
      actions={<Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export report</Button>}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="overflow-hidden border-border/60 shadow-[var(--shadow-card)]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
                </div>
                <div className={`rounded-lg bg-muted p-2 ${s.tone}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-success">
                <ArrowUpRight className="h-3 w-3" />
                <span>{s.delta}</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display">Monthly Revenue</CardTitle>
              <p className="text-sm text-muted-foreground">Last 7 months</p>
            </div>
            <Badge variant="secondary" className="gap-1"><TrendingUp className="h-3 w-3" />+42% YTD</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} formatter={(v: number) => `₹${v.toLocaleString()}`} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="font-display">Category Mix</CardTitle>
            <p className="text-sm text-muted-foreground">Orders by category</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryMix} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {categoryMix.map((_, i) => <Cell key={i} fill={chartColors[(i % 5) + 1] || "var(--color-chart-1)"} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Orders this Week</CardTitle>
            <Badge variant="secondary">1,398 total</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="orders" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="font-display">Top Selling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {top.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-lg">{p.image}</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.sold} sold · ₹{p.price}</p>
                </div>
                <Badge variant={i === 0 ? "default" : "secondary"} className={i === 0 ? "bg-primary" : ""}>#{i + 1}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border/60 shadow-[var(--shadow-card)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display">Recent Orders</CardTitle>
          <Button variant="ghost" size="sm" asChild><a href="/orders">View all →</a></Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {recent.map((o) => (
              <div key={o.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="font-semibold">{o.id} · {o.customer}</p>
                  <p className="text-xs text-muted-foreground">{o.items.length} item(s) · {o.paymentMode}</p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={o.status} />
                  <span className="font-display font-bold">₹{o.total}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: keyof typeof statusLabel }) {
  const map = {
    pending: "bg-warning/15 text-warning-foreground border-warning/30",
    preparing: "bg-chart-3/15 text-chart-3 border-chart-3/30",
    on_the_way: "bg-chart-4/15 text-warning-foreground border-chart-4/30",
    delivered: "bg-success/15 text-success border-success/30",
    cancelled: "bg-destructive/10 text-destructive border-destructive/30",
  } as const;
  return <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[status]}`}>{statusLabel[status]}</span>;
}
