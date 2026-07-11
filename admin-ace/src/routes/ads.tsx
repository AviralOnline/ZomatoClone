import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ads } from "@/lib/mock-data";
import { Plus, Eye, MousePointerClick, TrendingUp, Megaphone } from "lucide-react";

export const Route = createFileRoute("/ads")({
  head: () => ({ meta: [{ title: "Ads & Promotions — Zamato Partner" }, { name: "description", content: "Create and manage banner ads, featured listings and push campaigns." }] }),
  component: AdsPage,
});

const tone: Record<string, string> = {
  Active: "bg-success/15 text-success border-success/30",
  Paused: "bg-warning/15 text-warning-foreground border-warning/30",
  Ended: "bg-muted text-muted-foreground border-border",
};

function AdsPage() {
  const totalImp = ads.reduce((s, a) => s + a.impressions, 0);
  const totalClicks = ads.reduce((s, a) => s + a.clicks, 0);
  const totalSpent = ads.reduce((s, a) => s + a.spent, 0);
  const ctr = ((totalClicks / totalImp) * 100).toFixed(2);

  return (
    <AppShell
      title="Ads & Promotions"
      subtitle="Grow visibility with targeted campaigns"
      actions={<Button className="bg-primary hover:bg-primary/90 shadow-[var(--shadow-glow)]"><Plus className="mr-2 h-4 w-4" />New campaign</Button>}
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={Eye} label="Impressions" value={totalImp.toLocaleString()} />
        <MetricCard icon={MousePointerClick} label="Clicks" value={totalClicks.toLocaleString()} />
        <MetricCard icon={TrendingUp} label="CTR" value={`${ctr}%`} />
        <MetricCard icon={Megaphone} label="Spent" value={`₹${totalSpent.toLocaleString()}`} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {ads.map((a) => {
          const pct = Math.min(100, (a.spent / a.budget) * 100);
          return (
            <Card key={a.id} className="border-border/60 shadow-[var(--shadow-card)]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-bold">{a.title}</h3>
                      <Badge variant="secondary">{a.type}</Badge>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${tone[a.status]}`}>{a.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Ends {a.endsAt}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Budget used</span>
                    <span className="font-semibold">₹{a.spent.toLocaleString()} / ₹{a.budget.toLocaleString()}</span>
                  </div>
                  <Progress value={pct} className="mt-2 h-2" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
                  <Stat label="Impressions" value={a.impressions.toLocaleString()} />
                  <Stat label="Clicks" value={a.clicks.toLocaleString()} />
                  <Stat label="CTR" value={`${((a.clicks / a.impressions) * 100).toFixed(2)}%`} />
                </div>

                <div className="mt-4 flex gap-2">
                  {a.status === "Active" && <Button size="sm" variant="outline">Pause</Button>}
                  {a.status === "Paused" && <Button size="sm" className="bg-primary hover:bg-primary/90">Resume</Button>}
                  <Button size="sm" variant="ghost">Edit</Button>
                  <Button size="sm" variant="ghost">View analytics</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-display font-bold">{value}</p>
    </div>
  );
}
