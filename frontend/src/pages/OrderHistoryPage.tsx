import React, { useState, useEffect } from "react";
import { Search, Calendar, Package, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { orderService, productService } from "../services/api";
import type { Order, Product } from "../types";

const OrderHistoryPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<{ [key: number]: Product }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await productService.getProducts();
        const productsMap: { [key: number]: Product } = {};
        productsData.forEach((product) => {
          productsMap[product.id] = product;
        });
        setProducts(productsMap);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const ordersData = await orderService.getOrders(email);
      setOrders(ordersData);
      setSearched(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal memuat riwayat pesanan");
      }
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId: number) => {
    return products[productId]?.name || `Product ${productId}`;
  };

  const getProductPrice = (productId: number) => {
    return products[productId]?.price || 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Riwayat Pesanan</h1>
            <p className="text-gray-600">Cari pesanan Anda menggunakan email</p>
          </div>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </Link>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email yang digunakan untuk order"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2">
                <Search size={16} />
                <span>{loading ? "Mencari..." : "Cari Pesanan"}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Error Message */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {/* Results */}
        {searched && !loading && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Package size={24} />
              <span>Hasil Pencarian untuk: {email}</span>
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Package size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada pesanan ditemukan</h3>
                <p className="text-gray-600">Tidak ada pesanan yang terkait dengan email ini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id.toString().padStart(6, "0")}</h3>
                        <p className="text-gray-600 text-sm flex items-center space-x-1 mt-1">
                          <Calendar size={14} />
                          <span>{formatDate(order.created_at)}</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>{order.status}</span>
                        <span className="text-lg font-bold text-green-600">Rp {order.total_amount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Items:</h4>
                      <div className="space-y-2">
                        {order.order_items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>
                              {getProductName(item.product_id)} × {item.quantity}
                            </span>
                            <span>Rp {((item.price_at_time || getProductPrice(item.product_id)) * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm text-gray-600">
                        <strong>Alamat Pengiriman:</strong> {order.shipping_address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Mencari pesanan...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
