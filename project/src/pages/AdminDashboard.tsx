import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  TrendingUp, Users, ShoppingBag, AlertTriangle, Search, ShieldAlert,
  UserCheck, Eye, Edit2, RotateCcw, Activity, IndianRupee,
  LogOut, CheckCircle, Package, ArrowRight
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface UserItem {
  id: number;
  mobile: string;
  image: string | null;
  isAdmin: boolean;
  isBlocked: boolean;
  createdAt: string;
}

interface OrderItem {
  id: number;
  orderId: string;
  orderNumber: string;
  userId: number;
  restaurantName: string;
  items: string; // JSON String
  totalPrice: number;
  deliveryFee: number;
  platformFee: number;
  gst: number;
  tip: number;
  discount: number;
  total: number;
  grandTotal: number;
  address: string;
  paymentMethod: string;
  paymentMode: string;
  status: string;
  createdAt: string;
  user?: {
    mobile: string;
  };
}

interface ProductItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isBestseller: boolean;
  stock: number;
  active: boolean;
  category?: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  // Protect route
  if (!token || !currentUser || !currentUser.isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'users' | 'products'>('analytics');
  const [users, setUsers] = useState<UserItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search queries
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Selected details modal
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editMobile, setEditMobile] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [restockAmount, setRestockAmount] = useState<{ [productId: number]: string }>({});

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/users/all`, { headers }),
        fetch(`${API_BASE_URL}/api/orders/all`, { headers }),
        fetch(`${API_BASE_URL}/api/products`)
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  // Block/Unblock user
  const handleToggleBlock = async (user: UserItem) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ isBlocked: !user.isBlocked })
      });
      if (response.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u));
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to update user.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Admin status
  const handleToggleAdmin = async (user: UserItem) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ isAdmin: !user.isAdmin })
      });
      if (response.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, isAdmin: !u.isAdmin } : u));
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to update user.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit user details
  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const payload: any = {};
      if (editMobile) payload.mobile = editMobile;
      if (editPassword) payload.password = editPassword;

      const response = await fetch(`${API_BASE_URL}/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await response.json();
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, mobile: editMobile || u.mobile } : u));
        setEditingUser(null);
        setEditMobile('');
        setEditPassword('');
        alert('User details updated successfully!');
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to update user.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Restock product stock level
  const handleRestockProduct = async (product: ProductItem, amountStr: string) => {
    const qty = parseInt(amountStr);
    if (isNaN(qty) || qty < 0) {
      alert('Please enter a valid stock quantity.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${product.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ stock: (product.stock || 0) + qty })
      });
      if (response.ok) {
        setProducts(products.map(p => p.id === product.id ? { ...p, stock: (p.stock || 0) + qty } : p));
        setRestockAmount({ ...restockAmount, [product.id]: '' });
        alert(`Successfully restocked ${qty} units of ${product.name}!`);
      } else {
        alert('Failed to restock product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete an order
  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers
      });
      if (response.ok) {
        setOrders(orders.filter(o => o.id !== orderId));
        setSelectedOrder(null);
        alert('Order deleted successfully.');
      } else {
        alert('Failed to delete order.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Analytics helper calculations
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0);

  const activeUserCount = users.filter(u => !u.isBlocked).length;
  const blockedUserCount = users.filter(u => u.isBlocked).length;
  const lowStockProducts = products.filter(p => (p.stock || 0) < 10);

  // Search filters
  const filteredUsers = users.filter(u => u.mobile.toLowerCase().includes(userSearch.toLowerCase()));
  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
    (o.restaurantName && o.restaurantName.toLowerCase().includes(orderSearch.toLowerCase())) ||
    (o.user && o.user.mobile.includes(orderSearch))
  );
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg text-white">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Zamato Admin</h2>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Back-Office v1.2</span>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'analytics' ? 'bg-red-600 text-white shadow-lg shadow-red-600/10' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Metrics & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'orders' ? 'bg-red-600 text-white shadow-lg shadow-red-600/10' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Management</span>
              {orders.filter(o => o.status === 'Order Placed' || o.status === 'preparing').length > 0 && (
                <span className="ml-auto bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full text-xs font-bold">
                  {orders.filter(o => o.status === 'Order Placed' || o.status === 'preparing').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'users' ? 'bg-red-600 text-white shadow-lg shadow-red-600/10' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Users className="w-4 h-4" />
              <span>User Operations</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'products' ? 'bg-red-600 text-white shadow-lg shadow-red-600/10' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Package className="w-4 h-4" />
              <span>Product Inventory</span>
              {lowStockProducts.length > 0 && (
                <span className="ml-auto bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
                  {lowStockProducts.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center font-bold text-red-500">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Logged in as</p>
              <p className="text-sm font-bold truncate text-slate-200">{currentUser.mobile}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Back-Office Console</h1>
            <p className="text-slate-400 text-sm mt-1">Manual configurations and operational panel</p>
          </div>
          <button 
            onClick={fetchData}
            className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl hover:text-white transition-colors cursor-pointer"
            title="Refresh statistics"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </header>

        {loading ? (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center">
            <span className="w-10 h-10 border-4 border-slate-800 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* 1. ANALYTICS METRICS PANEL */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                
                {/* Low Stock Warning Banner */}
                {lowStockProducts.length > 0 && (
                  <div className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-start gap-4 shadow-lg shadow-yellow-500/5">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <h4 className="font-bold text-base text-yellow-200">Action Required: Low Stock Items Detected</h4>
                      <p className="text-sm text-yellow-400/80 mt-1">
                        There are {lowStockProducts.length} items in the inventory with stock below 10 units. Please review the Product Inventory tab and restock.
                      </p>
                      <button 
                        onClick={() => setActiveTab('products')} 
                        className="mt-3 text-xs font-bold text-yellow-200 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Inventory Console</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gross Revenue</p>
                        <p className="text-3xl font-extrabold text-white mt-2 flex items-center">
                          <IndianRupee className="w-6 h-6 text-red-500 inline-block mr-1" />
                          {totalRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 block mt-4">Gross aggregate (excluding cancelled orders)</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Orders Placed</p>
                        <p className="text-3xl font-extrabold text-white mt-2">{orders.length}</p>
                      </div>
                      <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 block mt-4">{orders.filter(o => o.status === 'delivered').length} orders completed</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Customers</p>
                        <p className="text-3xl font-extrabold text-white mt-2">{activeUserCount}</p>
                      </div>
                      <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                        <UserCheck className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 block mt-4">Authorized, unblocked users</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Blocked Accesses</p>
                        <p className="text-3xl font-extrabold text-white mt-2">{blockedUserCount}</p>
                      </div>
                      <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 block mt-4">Users flagged and denied database login</span>
                  </div>
                </div>

                {/* Analytical tables */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-white">Recent Orders (Realtime)</h3>
                    <div className="divide-y divide-slate-800 overflow-hidden">
                      {orders.slice(0, 5).map((o) => (
                        <div key={o.id} className="py-3 flex justify-between items-center text-sm">
                          <div>
                            <p className="font-bold text-slate-200">{o.orderNumber} • {o.restaurantName}</p>
                            <p className="text-xs text-slate-500">Placed: {new Date(o.createdAt).toLocaleDateString()} at {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-100">₹{o.grandTotal || o.total}</p>
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold mt-1 border ${
                              o.status === 'delivered' ? 'bg-green-500/15 border-green-500/30 text-green-400' :
                              o.status === 'cancelled' ? 'bg-red-500/15 border-red-500/30 text-red-400' :
                              o.status === 'Order Placed' ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' :
                              'bg-yellow-500/15 border-yellow-500/30 text-yellow-400'
                            }`}>{o.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-white">User Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Total User Base</span>
                        <span className="font-bold text-white">{users.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Administrators</span>
                        <span className="font-bold text-red-500">{users.filter(u => u.isAdmin).length}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Standard Accounts</span>
                        <span className="font-bold text-white">{users.filter(u => !u.isAdmin).length}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Blocked Accesses</span>
                        <span className="font-bold text-yellow-500">{blockedUserCount}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Active Rate</span>
                        <span className="font-bold text-green-500">
                          {users.length > 0 ? Math.round((activeUserCount / users.length) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 2. ORDER MANAGEMENT & STATUS UPDATES */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                
                {/* Search orders */}
                <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl max-w-md shadow-md">
                  <Search className="w-5 h-5 text-slate-500 ml-1" />
                  <input
                    type="text"
                    placeholder="Search by Order #, Restaurant or Customer..."
                    className="w-full bg-transparent focus:outline-none text-sm text-slate-100 placeholder-slate-500"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                  />
                </div>

                {/* Orders table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider">
                          <th className="p-4">Order Code</th>
                          <th className="p-4">Restaurant</th>
                          <th className="p-4">Customer ID</th>
                          <th className="p-4">Payment</th>
                          <th className="p-4">Grand Total</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Inspect</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {filteredOrders.map((o) => (
                          <tr key={o.id} className="hover:bg-slate-800/25 transition-colors">
                            <td className="p-4 font-bold text-slate-200">{o.orderNumber}</td>
                            <td className="p-4 text-slate-300 font-semibold">{o.restaurantName}</td>
                            <td className="p-4 text-slate-400">{o.user ? o.user.mobile : `User ID: ${o.userId}`}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded bg-slate-850 border border-slate-800 text-xs font-medium text-slate-400">
                                {o.paymentMethod || o.paymentMode || 'COD'}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-slate-100">₹{o.grandTotal || o.total}</td>
                            <td className="p-4">
                              <select
                                className="bg-slate-950 border border-slate-800 focus:border-red-500/50 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-200 focus:outline-none"
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                              >
                                <option value="Order Placed">Order Placed</option>
                                <option value="preparing">Preparing</option>
                                <option value="on_the_way">On the Way</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => setSelectedOrder(o)}
                                className="p-2 bg-slate-800 hover:bg-red-600 hover:text-white rounded-xl text-slate-400 transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredOrders.length === 0 && (
                    <div className="p-12 text-center text-slate-500 font-medium">No order records found matching details.</div>
                  )}
                </div>
              </div>
            )}

            {/* 3. USER ACCESS & ACCESS RESTRICTION CONTROLS */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                
                {/* Search users */}
                <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl max-w-md shadow-md">
                  <Search className="w-5 h-5 text-slate-500 ml-1" />
                  <input
                    type="text"
                    placeholder="Search by User Identifier/Mobile..."
                    className="w-full bg-transparent focus:outline-none text-sm text-slate-100 placeholder-slate-500"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>

                {/* Users List */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider">
                          <th className="p-4">User Identifier</th>
                          <th className="p-4">Role Privileges</th>
                          <th className="p-4">Profile Image</th>
                          <th className="p-4">Status Flag</th>
                          <th className="p-4 text-center">Block Operations</th>
                          <th className="p-4 text-center">Admin Controls</th>
                          <th className="p-4 text-center">Edit Config</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-800/25 transition-colors">
                            <td className="p-4 font-bold text-slate-200">
                              {u.mobile}
                              {u.id === currentUser.id && (
                                <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-bold">You</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-xs font-extrabold border ${u.isAdmin ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-slate-800/40 border-slate-850 text-slate-400'}`}>
                                {u.isAdmin ? 'ADMINISTRATOR' : 'CUSTOMER'}
                              </span>
                            </td>
                            <td className="p-4">
                              {u.image ? (
                                <img src={u.image.startsWith('http') ? u.image : `${API_BASE_URL}${u.image}`} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-slate-800" />
                              ) : (
                                <span className="text-slate-600 italic text-xs">None</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${u.isBlocked ? 'bg-red-500/15 border-red-500/30 text-red-400' : 'bg-green-500/15 border-green-500/30 text-green-400'}`}>
                                {u.isBlocked ? 'Blocked Access' : 'Authorized'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleToggleBlock(u)}
                                disabled={u.id === currentUser.id}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                                  u.isBlocked 
                                    ? 'bg-green-600/10 border-green-600/20 text-green-400 hover:bg-green-600 hover:text-white' 
                                    : 'bg-red-600/10 border-red-600/20 text-red-400 hover:bg-red-600 hover:text-white'
                                } disabled:opacity-30 disabled:cursor-not-allowed`}
                              >
                                {u.isBlocked ? 'Authorize Login' : 'Revoke Login'}
                              </button>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleToggleAdmin(u)}
                                disabled={u.id === currentUser.id}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                                  u.isAdmin 
                                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-red-600 hover:text-white' 
                                    : 'bg-red-600/10 border-red-600/20 text-red-400 hover:bg-red-600 hover:text-white'
                                } disabled:opacity-30 disabled:cursor-not-allowed`}
                              >
                                {u.isAdmin ? 'Demote User' : 'Promote Admin'}
                              </button>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => {
                                  setEditingUser(u);
                                  setEditMobile(u.mobile);
                                }}
                                className="p-2 bg-slate-800 hover:bg-red-600 hover:text-white rounded-xl text-slate-400 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredUsers.length === 0 && (
                    <div className="p-12 text-center text-slate-500 font-medium">No user records found matching details.</div>
                  )}
                </div>
              </div>
            )}

            {/* 4. PRODUCT INVENTORY & STOCK RESTOCKING */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                
                {/* Search products */}
                <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl max-w-md shadow-md">
                  <Search className="w-5 h-5 text-slate-500 ml-1" />
                  <input
                    type="text"
                    placeholder="Search by Product Name..."
                    className="w-full bg-transparent focus:outline-none text-sm text-slate-100 placeholder-slate-500"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>

                {/* Products Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-800/40 text-slate-400 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider">
                          <th className="p-4">Product Info</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Indicator Status</th>
                          <th className="p-4">Current Stock</th>
                          <th className="p-4">Restock Qty</th>
                          <th className="p-4 text-center">Restock Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {filteredProducts.map((p) => {
                          const isLowStock = (p.stock || 0) < 10;
                          return (
                            <tr key={p.id} className="hover:bg-slate-800/25 transition-colors">
                              <td className="p-4 font-bold text-slate-200">
                                <div className="flex items-center gap-3">
                                  {p.image ? (
                                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-slate-800" />
                                  ) : (
                                    <span className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center font-bold text-xs">P</span>
                                  )}
                                  <div>
                                    <p className="text-slate-100 font-semibold">{p.name}</p>
                                    <span className={`inline-block w-2.5 h-2.5 rounded-full border border-slate-950 ${p.isVeg ? 'bg-success' : 'bg-destructive'}`} title={p.isVeg ? 'Veg' : 'Non-Veg'} />
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-slate-400 font-medium">{p.category || 'Featured'}</td>
                              <td className="p-4 text-slate-200 font-bold">₹{p.price}</td>
                              <td className="p-4">
                                {isLowStock ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 animate-pulse">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Low Stock</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/15 border border-green-500/30 text-green-400">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>In Stock</span>
                                  </span>
                                )}
                              </td>
                              <td className={`p-4 font-bold ${isLowStock ? 'text-yellow-400' : 'text-slate-300'}`}>
                                {p.stock || 0} units
                              </td>
                              <td className="p-4">
                                <input
                                  type="number"
                                  min="1"
                                  placeholder="+20"
                                  className="w-20 px-2 py-1.5 bg-slate-950 border border-slate-800 focus:border-red-500/50 rounded-xl focus:outline-none text-xs text-slate-200"
                                  value={restockAmount[p.id] || ''}
                                  onChange={(e) => setRestockAmount({ ...restockAmount, [p.id]: e.target.value })}
                                />
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleRestockProduct(p, restockAmount[p.id] || '')}
                                  className="px-3 py-1.5 bg-slate-800 hover:bg-red-600 hover:text-white rounded-xl text-slate-300 text-xs font-bold transition-all cursor-pointer shadow-md"
                                >
                                  Restock Item
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {filteredProducts.length === 0 && (
                    <div className="p-12 text-center text-slate-500 font-medium">No menu products found.</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* --- MODAL DIALOGS --- */}

        {/* 1. ORDER INSPECTOR MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleUp">
              
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                <div>
                  <h3 className="font-extrabold text-xl text-white">Order Inspector</h3>
                  <p className="text-xs text-slate-500 mt-1">{selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Restaurant</span>
                    <span className="font-bold text-slate-200">{selectedOrder.restaurantName}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Customer ID / Mobile</span>
                    <span className="font-bold text-slate-200">{selectedOrder.user ? selectedOrder.user.mobile : `User ID: ${selectedOrder.userId}`}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Payment Mode</span>
                    <span className="font-bold text-slate-200">{selectedOrder.paymentMethod || selectedOrder.paymentMode || 'COD'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Order Date</span>
                    <span className="font-bold text-slate-200">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Delivery Address</span>
                  <p className="text-slate-300 text-sm leading-relaxed">{selectedOrder.address}</p>
                </div>

                {/* Items Breakdown */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-3">Item Breakdown</span>
                  <div className="bg-slate-950/20 border border-slate-850 rounded-2xl overflow-hidden divide-y divide-slate-850">
                    {(() => {
                      let itemsArr = [];
                      try {
                        itemsArr = JSON.parse(selectedOrder.items);
                      } catch (e) {
                        itemsArr = [];
                      }
                      if (!Array.isArray(itemsArr)) itemsArr = [];

                      return itemsArr.map((item: any, i: number) => (
                        <div key={i} className="p-3.5 flex justify-between items-center text-sm">
                          <div>
                            <span className="font-bold text-slate-250">{item.name}</span>
                            <span className="text-slate-500 text-xs ml-2">x{item.quantity}</span>
                          </div>
                          <span className="font-bold text-slate-100">₹{item.price * item.quantity}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Order calculations */}
                <div className="space-y-2 border-t border-slate-850 pt-4">
                  <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>Subtotal Price</span>
                    <span>₹{selectedOrder.totalPrice || (selectedOrder.total - (selectedOrder.deliveryFee || 40) - (selectedOrder.gst || 0))}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>Delivery Charge</span>
                    <span>₹{selectedOrder.deliveryFee || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>Platform Fee</span>
                    <span>₹{selectedOrder.platformFee || 5}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>GST (5%)</span>
                    <span>₹{selectedOrder.gst || 0}</span>
                  </div>
                  {selectedOrder.tip > 0 && (
                    <div className="flex justify-between items-center text-sm text-slate-400">
                      <span>Rider Tip</span>
                      <span>₹{selectedOrder.tip}</span>
                    </div>
                  )}
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between items-center text-sm text-red-400">
                      <span>Discount Availed</span>
                      <span>-₹{selectedOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-base font-bold text-white border-t border-slate-800 pt-3">
                    <span>Grand Total</span>
                    <span>₹{selectedOrder.grandTotal || selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-800 bg-slate-950/40 flex justify-between gap-3">
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="px-4 py-2.5 bg-red-600/10 border border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Delete Order
                </button>
                <div className="flex gap-3">
                  <select
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-200 focus:outline-none"
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="preparing">Preparing</option>
                    <option value="on_the_way">On the Way</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. USER EDIT DETAILS CONFIG MODAL */}
        {editingUser && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleUp">
              
              <div className="p-6 border-b border-slate-800 bg-slate-950/40 flex justify-between items-center">
                <h3 className="font-extrabold text-xl text-white">Edit User Configuration</h3>
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setEditMobile('');
                    setEditPassword('');
                  }}
                  className="px-4 py-2 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleSaveUserEdit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    User Identifier / Mobile
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-red-500/50 rounded-xl focus:outline-none text-slate-100 text-sm"
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Reset Password (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-red-500/50 rounded-xl focus:outline-none text-slate-100 text-sm"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Leave empty to keep current password.</span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl font-bold transition-all cursor-pointer shadow-md"
                >
                  Save Configuration
                </button>
              </form>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
