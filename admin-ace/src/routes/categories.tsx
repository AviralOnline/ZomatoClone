import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "Categories - Zamato Partner" }, { name: "description", content: "Organize your menu into categories customers can browse." }] }),
  component: CategoriesPage,
});

const API_URL = "http://localhost:8001/api";

type Category = {
  id: number;
  name: string;
  image: string;
  items: number;
  active: boolean;
};

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  async function loadCategories() {
    const response = await fetch(`${API_URL}/categories`);
    setCategories(await response.json());
  }

  useEffect(() => {
    loadCategories().catch(() => setCategories([]));
  }, []);

  async function createCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image, active: true }),
    });
    setName("");
    setImage("");
    setOpen(false);
    await loadCategories();
  }

  async function toggleCategory(category: Category, active: boolean) {
    await fetch(`${API_URL}/categories/${category.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    setCategories((current) => current.map((item) => item.id === category.id ? { ...item, active } : item));
  }

  return (
    <AppShell
      title="Categories"
      subtitle="Group your menu items so customers can browse easily"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-[var(--shadow-glow)]">
              <Plus className="mr-2 h-4 w-4" />New category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New category</DialogTitle>
            </DialogHeader>
            <form onSubmit={createCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Fast Food, Lunch, Dinner" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button>Create category</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Card key={c.id} className="border-border/60 shadow-[var(--shadow-card)]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md bg-accent text-xl font-bold">
                    {c.image ? <img src={c.image} alt={c.name} className="h-full w-full object-cover" /> : c.name.slice(0, 1)}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.items} items</p>
                  </div>
                </div>
                <Badge variant={c.active ? "default" : "secondary"} className={c.active ? "bg-success text-success-foreground" : ""}>
                  {c.active ? "Live" : "Hidden"}
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Switch checked={c.active} onCheckedChange={(active) => toggleCategory(c, active)} />
                  <span className="text-xs text-muted-foreground">Visible to customers</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
