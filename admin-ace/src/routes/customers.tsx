import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { customers } from "@/lib/mock-data";
import { Search, Phone, Mail, MapPin, Download } from "lucide-react";

export const Route = createFileRoute("/customers")({
  head: () => ({ meta: [{ title: "Customers — Zamato Partner" }, { name: "description", content: "Details of customers who ordered from your restaurant." }] }),
  component: CustomersPage,
});

const initials = (n: string) => n.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();

function CustomersPage() {
  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalOrders = customers.reduce((s, c) => s + c.totalOrders, 0);

  return (
    <AppShell
      title="Customer Details"
      subtitle="Everyone who has ordered from your restaurant"
      actions={<Button variant="outline"><Download className="mr-2 h-4 w-4" />Export CSV</Button>}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total customers" value={customers.length.toString()} />
        <StatCard label="Total orders" value={totalOrders.toLocaleString()} />
        <StatCard label="Lifetime revenue" value={`₹${totalSpent.toLocaleString()}`} />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, phone…" className="pl-9" />
        </div>
      </div>

      <Card className="mt-4 border-border/60 shadow-[var(--shadow-card)]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium text-right">Orders</th>
                  <th className="px-4 py-3 font-medium text-right">Spent</th>
                  <th className="px-4 py-3 font-medium">Last Order</th>
                  <th className="px-4 py-3 font-medium">Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((c) => {
                  const tier = c.totalSpent > 15000 ? "Gold" : c.totalSpent > 5000 ? "Silver" : "New";
                  return (
                    <tr key={c.id} className="text-sm transition hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials(c.name)}</AvatarFallback></Avatar>
                          <div>
                            <p className="font-semibold">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="flex items-center gap-1.5 text-xs"><Phone className="h-3 w-3 text-muted-foreground" />{c.phone}</p>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{c.email}</p>
                      </td>
                      <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-sm"><MapPin className="h-3 w-3 text-muted-foreground" />{c.city}</span></td>
                      <td className="px-4 py-3 text-right font-semibold">{c.totalOrders}</td>
                      <td className="px-4 py-3 text-right font-display font-bold text-primary">₹{c.totalSpent.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(c.lastOrder).toLocaleDateString("en-IN", { dateStyle: "medium" })}</td>
                      <td className="px-4 py-3">
                        <Badge className={
                          tier === "Gold" ? "bg-warning text-warning-foreground"
                            : tier === "Silver" ? "bg-muted text-foreground"
                            : "bg-accent text-accent-foreground"
                        }>{tier}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-2 font-display text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
