import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, Utensils, TrendingUp, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login - Zamato Partner" },
      { name: "description", content: "Sign in to your Zamato restaurant partner account." },
    ],
  }),
  component: LoginPage,
});

const API_URL = "http://localhost:8001/api";

function LoginPage() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch(`${API_URL}/vendors/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Login failed");
      return;
    }

    localStorage.setItem("vendorToken", data.token);
    localStorage.setItem("vendor", JSON.stringify(data.vendor));
    navigate({ to: "/products" });
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="relative flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">zamato</span>
        </div>
        <div className="relative space-y-6">
          <h2 className="font-display text-4xl font-bold leading-tight">
            Run your restaurant, <span className="text-primary">not the paperwork.</span>
          </h2>
          <p className="max-w-md text-sidebar-foreground/70">
            One dashboard for orders, menu, customers, payouts and marketing.
          </p>
          <div className="grid gap-3">
            {[
              { icon: Utensils, t: "Restaurant-wise menu listing" },
              { icon: TrendingUp, t: "Vendor-wise orders" },
              { icon: ShieldCheck, t: "Secure partner login" },
            ].map(({ icon: Icon, t }) => (
              <div key={t} className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
                <Icon className="h-4 w-4 text-primary" /><span className="text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-sidebar-foreground/50">2026 Zamato Partner Services</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border/60 p-8 shadow-[var(--shadow-card)]">
          <h1 className="font-display text-2xl font-bold">Partner Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your restaurant.</p>
          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <Label htmlFor="mobile">Mobile</Label>
              <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="9876543210" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pass">Password</Label>
              <Input id="pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="h-11 w-full bg-primary hover:bg-primary/90 shadow-[var(--shadow-glow)]">Sign in</Button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            New partner? <Link to="/onboarding" className="font-semibold text-primary hover:underline">Onboard your restaurant</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
