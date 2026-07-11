import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { reviews } from "@/lib/mock-data";
import { Star, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [{ title: "Reviews — Zamato Partner" }, { name: "description", content: "See what customers are saying and reply to reviews." }] }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const dist = [5, 4, 3, 2, 1].map((n) => ({
    n, count: reviews.filter((r) => r.rating === n).length,
  }));
  const max = Math.max(...dist.map((d) => d.count), 1);

  return (
    <AppShell title="Reviews" subtitle="What customers think of your restaurant">
      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-display text-5xl font-bold text-primary">{avg}</p>
                <div className="mt-1 flex justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`h-4 w-4 ${i <= Math.round(+avg) ? "fill-warning text-warning" : "text-muted"}`} />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{reviews.length} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {dist.map((d) => (
                  <div key={d.n} className="flex items-center gap-2 text-xs">
                    <span className="w-3 font-semibold">{d.n}</span>
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(d.count / max) * 100}%` }} />
                    </div>
                    <span className="w-6 text-right text-muted-foreground">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {reviews.map((r) => (
            <Card key={r.id} className="border-border/60 shadow-[var(--shadow-card)]">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary font-semibold">{r.customer.split(" ").map((x) => x[0]).join("")}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{r.customer}</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i <= r.rating ? "fill-warning text-warning" : "text-muted"}`} />
                        ))}
                      </div>
                      <Badge variant="secondary" className="text-xs">{r.dish}</Badge>
                      <span className="ml-auto text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <p className="mt-2 text-sm text-foreground">{r.comment}</p>
                    <div className="mt-3 flex items-center gap-2">
                      {r.replied
                        ? <Badge className="bg-success/15 text-success border-success/30" variant="outline">✓ Replied</Badge>
                        : <Button size="sm" variant="outline"><MessageSquare className="mr-2 h-3 w-3" />Reply</Button>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
