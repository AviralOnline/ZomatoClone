import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Star } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "Menu & Products - Zamato Partner" }, { name: "description", content: "Manage your restaurant menu, prices and availability." }] }),
  component: ProductsPage,
});

const API_URL = "http://localhost:8001/api";

type Category = { id: number; name: string };
type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  categoryId: number;
  price: number;
  stock: number;
  isVeg: boolean;
  isBestseller: boolean;
  active: boolean;
  image: string;
  rating: number;
  sold: number;
};

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "10",
  image: "",
  categoryId: "",
  isVeg: true,
  isBestseller: false,
  active: true,
};

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const categoryGroups = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))], [products]);

  async function loadMenu() {
    setLoading(true);
    const vendorToken = localStorage.getItem("vendorToken");
    const [productRes, categoryRes] = await Promise.all([
      fetch(vendorToken ? `${API_URL}/products/vendor/me` : `${API_URL}/products`, {
        headers: vendorToken ? { Authorization: `Bearer ${vendorToken}` } : {},
      }),
      fetch(`${API_URL}/categories`),
    ]);
    setProducts(await productRes.json());
    setCategories(await categoryRes.json());
    setLoading(false);
  }

  useEffect(() => {
    loadMenu().catch(() => setLoading(false));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("vendorToken") || ""}`,
      },
      body: JSON.stringify({
        ...form,
        categoryId: Number(form.categoryId),
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    });

    setForm(emptyForm);
    setOpen(false);
    await loadMenu();
    setSaving(false);
  }

  return (
    <AppShell
      title="Menu & Products"
      subtitle={loading ? "Loading menu items" : `${products.length} items across ${categoryGroups.length} categories`}
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-[var(--shadow-glow)]">
              <Plus className="mr-2 h-4 w-4" />Add product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Product name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.categoryId} onValueChange={(value) => setForm({ ...form, categoryId: value })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" min="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              </div>
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.isVeg} onCheckedChange={(value) => setForm({ ...form, isVeg: value })} /> Veg item</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.isBestseller} onCheckedChange={(value) => setForm({ ...form, isBestseller: value })} /> Bestseller</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.active} onCheckedChange={(value) => setForm({ ...form, active: value })} /> Active</label>
              <div className="sm:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button disabled={saving || !form.categoryId}>{saving ? "Saving..." : "Save product"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {products.length === 0 && !loading ? (
        <div className="rounded-md border border-dashed border-border p-8 text-center text-muted-foreground">
          No products yet. Add your first product from the admin panel.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <Card key={p.id} className="group overflow-hidden border-border/60 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-accent to-muted text-6xl">
                {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" /> : <span>{p.name.slice(0, 1)}</span>}
                <div className="absolute left-3 top-3 flex items-center gap-1">
                  <span className={`flex h-5 w-5 items-center justify-center rounded border-2 ${p.isVeg ? "border-success" : "border-destructive"} bg-background`}>
                    <span className={`h-2.5 w-2.5 rounded-full ${p.isVeg ? "bg-success" : "bg-destructive"}`} />
                  </span>
                </div>
                <Badge className="absolute right-3 top-3 bg-background text-foreground shadow">
                  <Star className="mr-1 h-3 w-3 fill-warning text-warning" />{p.rating}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.category} - {p.sold} sold</p>
                  </div>
                  <p className="font-display font-bold text-primary">Rs {p.price}</p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked={p.active} id={String(p.id)} />
                    <label htmlFor={String(p.id)} className="text-xs text-muted-foreground">In stock ({p.stock})</label>
                  </div>
                  <Badge variant={p.active ? "default" : "secondary"}>{p.active ? "Live" : "Hidden"}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
