import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Flame, Check, Store, MapPin, FileText } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding - Zamato Partner" },
      { name: "description", content: "Set up your restaurant on Zamato." },
    ],
  }),
  component: Onboarding,
});

const API_URL = "http://localhost:8001/api";

const steps = [
  { icon: Store, title: "Restaurant details", desc: "Owner, login and cuisine" },
  { icon: MapPin, title: "Location & hours", desc: "Address and timings" },
  { icon: FileText, title: "Documents", desc: "FSSAI, GST, PAN" },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    ownerName: "",
    restaurantName: "",
    mobile: "",
    email: "",
    password: "",
    cuisine: "",
    image: "",
    address: "",
    city: "",
    pincode: "",
    opensAt: "10:00 AM",
    closesAt: "11:00 PM",
    fssai: "",
    gst: "",
    pan: "",
  });
  const navigate = useNavigate();
  const isLast = step === steps.length - 1;

  function updateField(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function registerVendor() {
    setSaving(true);
    setError("");
    const response = await fetch(`${API_URL}/vendors/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(data.error || "Onboarding failed");
      return;
    }

    localStorage.setItem("vendorToken", data.token);
    localStorage.setItem("vendor", JSON.stringify(data.vendor));
    navigate({ to: "/products" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"><Flame className="h-5 w-5 text-primary-foreground" /></div>
            <span className="font-display text-xl font-bold">zamato</span>
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Partner Onboarding</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/login" })}>Login instead</Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-2">
          {steps.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <button
                key={s.title}
                onClick={() => setStep(i)}
                className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
                  active ? "border-primary bg-primary/5 shadow-[var(--shadow-card)]" : "border-border hover:bg-muted/50"
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${done ? "bg-success text-success-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {done ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Step {i + 1}</p>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </aside>

        <Card className="p-8 shadow-[var(--shadow-card)]">
          <h1 className="font-display text-2xl font-bold">{steps[step].title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{steps[step].desc}</p>

          <div className="mt-6 grid gap-4">
            {step === 0 && (
              <>
                <Field label="Restaurant name" value={form.restaurantName} onChange={(value) => updateField("restaurantName", value)} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Owner name" value={form.ownerName} onChange={(value) => updateField("ownerName", value)} />
                  <Field label="Mobile" value={form.mobile} onChange={(value) => updateField("mobile", value)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email" value={form.email} onChange={(value) => updateField("email", value)} />
                  <Field label="Password" type="password" value={form.password} onChange={(value) => updateField("password", value)} />
                </div>
                <Field label="Cuisine" value={form.cuisine} onChange={(value) => updateField("cuisine", value)} />
                <Field label="Restaurant image URL" value={form.image} onChange={(value) => updateField("image", value)} />
              </>
            )}
            {step === 1 && (
              <>
                <Field label="Full address" as="textarea" value={form.address} onChange={(value) => updateField("address", value)} />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="City" value={form.city} onChange={(value) => updateField("city", value)} />
                  <Field label="Pincode" value={form.pincode} onChange={(value) => updateField("pincode", value)} />
                  <Field label="Opens at" value={form.opensAt} onChange={(value) => updateField("opensAt", value)} />
                </div>
                <Field label="Closes at" value={form.closesAt} onChange={(value) => updateField("closesAt", value)} />
              </>
            )}
            {step === 2 && (
              <>
                <Field label="FSSAI License Number" value={form.fssai} onChange={(value) => updateField("fssai", value)} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="GST Number" value={form.gst} onChange={(value) => updateField("gst", value)} />
                  <Field label="PAN Number" value={form.pan} onChange={(value) => updateField("pan", value)} />
                </div>
              </>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{step + 1} of {steps.length}</span>
              <Button
                className="bg-primary hover:bg-primary/90 shadow-[var(--shadow-glow)]"
                disabled={saving}
                onClick={() => (isLast ? registerVendor() : setStep(step + 1))}
              >
                {isLast ? (saving ? "Creating..." : "Create restaurant") : "Continue"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, as, type = "text" }: { label: string; value: string; onChange: (value: string) => void; as?: "textarea"; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {as === "textarea"
        ? <Textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} />
        : <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />}
    </div>
  );
}
