export type OrderStatus = "pending" | "preparing" | "on_the_way" | "delivered" | "cancelled";

export interface Order {
  id: string;
  customer: string;
  phone: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  placedAt: string; // ISO
  address: string;
  paymentMode: "COD" | "UPI" | "Card";
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  veg: boolean;
  active: boolean;
  image: string;
  rating: number;
  sold: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  city: string;
}

export interface Review {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  dish: string;
  date: string;
  replied: boolean;
}

export interface Category {
  id: string;
  name: string;
  items: number;
  emoji: string;
  active: boolean;
}

export interface Ad {
  id: string;
  title: string;
  type: "Banner" | "Featured" | "Push";
  status: "Active" | "Paused" | "Ended";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  endsAt: string;
}

export interface WalletTxn {
  id: string;
  date: string;
  desc: string;
  type: "credit" | "debit";
  amount: number;
}

const dishes = [
  { name: "Butter Chicken", cat: "Main Course", price: 320, veg: false, emoji: "🍗" },
  { name: "Paneer Tikka", cat: "Starters", price: 240, veg: true, emoji: "🧀" },
  { name: "Veg Biryani", cat: "Biryani", price: 220, veg: true, emoji: "🍚" },
  { name: "Chicken Biryani", cat: "Biryani", price: 280, veg: false, emoji: "🍛" },
  { name: "Masala Dosa", cat: "South Indian", price: 140, veg: true, emoji: "🥞" },
  { name: "Margherita Pizza", cat: "Pizza", price: 299, veg: true, emoji: "🍕" },
  { name: "Cheese Burger", cat: "Burgers", price: 179, veg: true, emoji: "🍔" },
  { name: "Gulab Jamun", cat: "Desserts", price: 90, veg: true, emoji: "🍮" },
  { name: "Cold Coffee", cat: "Beverages", price: 130, veg: true, emoji: "☕" },
  { name: "Tandoori Roti", cat: "Breads", price: 30, veg: true, emoji: "🫓" },
];

export const products: Product[] = dishes.map((d, i) => ({
  id: `P${1000 + i}`,
  name: d.name,
  category: d.cat,
  price: d.price,
  stock: Math.floor(Math.random() * 40) + 10,
  veg: d.veg,
  active: i !== 7,
  image: d.emoji,
  rating: +(3.8 + Math.random() * 1.2).toFixed(1),
  sold: Math.floor(Math.random() * 400) + 40,
}));

export const categories: Category[] = [
  { id: "C1", name: "Starters", items: 12, emoji: "🥗", active: true },
  { id: "C2", name: "Main Course", items: 24, emoji: "🍲", active: true },
  { id: "C3", name: "Biryani", items: 8, emoji: "🍚", active: true },
  { id: "C4", name: "South Indian", items: 15, emoji: "🥞", active: true },
  { id: "C5", name: "Pizza", items: 10, emoji: "🍕", active: true },
  { id: "C6", name: "Burgers", items: 6, emoji: "🍔", active: true },
  { id: "C7", name: "Desserts", items: 9, emoji: "🍰", active: true },
  { id: "C8", name: "Beverages", items: 14, emoji: "🥤", active: false },
  { id: "C9", name: "Breads", items: 7, emoji: "🫓", active: true },
];

const names = [
  "Rahul Sharma", "Priya Patel", "Aditya Verma", "Sneha Iyer", "Rohan Gupta",
  "Ananya Singh", "Vikram Rao", "Kavya Nair", "Arjun Mehta", "Ishita Joshi",
  "Karan Malhotra", "Neha Kapoor",
];
const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai"];

export const customers: Customer[] = names.map((n, i) => ({
  id: `U${2000 + i}`,
  name: n,
  phone: `+91 9${(800000000 + i * 12345).toString().slice(0, 9)}`,
  email: n.toLowerCase().replace(" ", ".") + "@mail.com",
  totalOrders: Math.floor(Math.random() * 50) + 3,
  totalSpent: Math.floor(Math.random() * 25000) + 800,
  lastOrder: new Date(Date.now() - Math.random() * 30 * 864e5).toISOString(),
  city: cities[i % cities.length],
}));

const statuses: OrderStatus[] = ["pending", "preparing", "on_the_way", "delivered", "delivered", "delivered", "cancelled"];

export const orders: Order[] = Array.from({ length: 24 }).map((_, i) => {
  const cust = customers[i % customers.length];
  const nItems = 1 + Math.floor(Math.random() * 3);
  const items = Array.from({ length: nItems }).map(() => {
    const p = products[Math.floor(Math.random() * products.length)];
    return { name: p.name, qty: 1 + Math.floor(Math.random() * 3), price: p.price };
  });
  const total = items.reduce((s, x) => s + x.qty * x.price, 0);
  return {
    id: `#ZM${5000 + i}`,
    customer: cust.name,
    phone: cust.phone,
    items,
    total,
    status: statuses[i % statuses.length],
    placedAt: new Date(Date.now() - i * 3.6e6).toISOString(),
    address: `${100 + i} MG Road, ${cust.city}`,
    paymentMode: (["UPI", "COD", "Card"] as const)[i % 3],
  };
});

export const reviews: Review[] = [
  { id: "R1", customer: "Rahul Sharma", rating: 5, comment: "Butter chicken was 🔥, delivered hot!", dish: "Butter Chicken", date: "2026-07-08", replied: true },
  { id: "R2", customer: "Priya Patel", rating: 4, comment: "Biryani portion could be bigger.", dish: "Chicken Biryani", date: "2026-07-08", replied: false },
  { id: "R3", customer: "Sneha Iyer", rating: 5, comment: "Best dosa in town!", dish: "Masala Dosa", date: "2026-07-07", replied: true },
  { id: "R4", customer: "Rohan Gupta", rating: 2, comment: "Cold when it arrived.", dish: "Margherita Pizza", date: "2026-07-06", replied: false },
  { id: "R5", customer: "Ananya Singh", rating: 5, comment: "Loved the paneer tikka marinade.", dish: "Paneer Tikka", date: "2026-07-05", replied: true },
  { id: "R6", customer: "Vikram Rao", rating: 3, comment: "Average taste, quick delivery though.", dish: "Cheese Burger", date: "2026-07-04", replied: false },
];

export const ads: Ad[] = [
  { id: "A1", title: "Monsoon Biryani Combo 20% Off", type: "Banner", status: "Active", budget: 5000, spent: 3240, impressions: 48210, clicks: 1820, endsAt: "2026-07-20" },
  { id: "A2", title: "Featured on Homepage", type: "Featured", status: "Active", budget: 8000, spent: 6100, impressions: 92000, clicks: 3600, endsAt: "2026-07-18" },
  { id: "A3", title: "Weekend Push Notification", type: "Push", status: "Paused", budget: 2000, spent: 1200, impressions: 15000, clicks: 480, endsAt: "2026-07-15" },
  { id: "A4", title: "New Customer Discount", type: "Banner", status: "Ended", budget: 3000, spent: 3000, impressions: 22000, clicks: 1100, endsAt: "2026-06-30" },
];

export const walletBalance = 42580;
export const walletPending = 8420;

export const walletTxns: WalletTxn[] = [
  { id: "T1", date: "2026-07-10", desc: "Payout to bank ****4521", type: "debit", amount: 25000 },
  { id: "T2", date: "2026-07-09", desc: "Orders settlement (48 orders)", type: "credit", amount: 18420 },
  { id: "T3", date: "2026-07-08", desc: "Ad spend – Featured", type: "debit", amount: 2400 },
  { id: "T4", date: "2026-07-07", desc: "Orders settlement (52 orders)", type: "credit", amount: 21200 },
  { id: "T5", date: "2026-07-06", desc: "Refund – Order #ZM4991", type: "debit", amount: 320 },
  { id: "T6", date: "2026-07-05", desc: "Orders settlement (39 orders)", type: "credit", amount: 15900 },
];

export const monthlyRevenue = [
  { month: "Jan", revenue: 148000, orders: 620 },
  { month: "Feb", revenue: 162000, orders: 690 },
  { month: "Mar", revenue: 155000, orders: 640 },
  { month: "Apr", revenue: 178000, orders: 740 },
  { month: "May", revenue: 205000, orders: 860 },
  { month: "Jun", revenue: 231000, orders: 960 },
  { month: "Jul", revenue: 258000, orders: 1080 },
];

export const weeklyOrders = [
  { day: "Mon", orders: 142 },
  { day: "Tue", orders: 168 },
  { day: "Wed", orders: 155 },
  { day: "Thu", orders: 189 },
  { day: "Fri", orders: 231 },
  { day: "Sat", orders: 268 },
  { day: "Sun", orders: 245 },
];

export const categoryMix = [
  { name: "Biryani", value: 32 },
  { name: "Main Course", value: 24 },
  { name: "Pizza", value: 15 },
  { name: "Starters", value: 12 },
  { name: "Desserts", value: 9 },
  { name: "Other", value: 8 },
];

export const statusLabel: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  on_the_way: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
