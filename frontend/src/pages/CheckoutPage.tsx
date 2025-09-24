import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { orderService } from "../services/api";
import type { CreateOrderData } from "../services/api";
import type { OrderItem } from "../types";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();

  const [formData, setFormData] = useState({
    customer_email: "",
    customer_name: "",
    shipping_address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validasi form
      if (!formData.customer_email || !formData.customer_name || !formData.shipping_address) {
        throw new Error("Harap isi semua field yang diperlukan");
      }

      if (cartItems.length === 0) {
        throw new Error("Keranjang belanja kosong");
      }

      // Prepare order data
      const orderData: CreateOrderData = {
        customer_email: formData.customer_email,
        customer_name: formData.customer_name,
        shipping_address: formData.shipping_address,
        order_items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      // Create order
      const order = await orderService.createOrder(orderData);

      console.log("Order created:", order);

      const orderWithProductDetails = {
        ...order,
        order_items:
          order.order_items?.map((orderItem) => {
            const cartItem = cartItems.find((item) => item.product.id === orderItem.product_id);
            return {
              ...orderItem,
              product_name: cartItem?.product.name || `Product ${orderItem.product_id}`,
              price_at_time: cartItem?.product.price || 0, // Gunakan harga dari cart
            };
          }) || ([] as OrderItem[]),
      };

      // Clear cart and redirect to success page
      clearCart();
      navigate("/order-success", {
        state: {
          order: orderWithProductDetails,
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal membuat pesanan");
      }
    } finally {
      setLoading(false);
    }
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Belanja Kosong</h2>
          <p className="text-gray-600 mb-6">Tambahkan beberapa item makanan sebelum checkout</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2">
            <ArrowLeft size={16} />
            <span>Kembali Berbelanja</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between py-4 border-b">
                  <div className="flex items-center space-x-4 flex-1">
                    <img src={item.product.image_url || "/images/placeholder-food.jpg"} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-green-600 font-bold">Rp {item.product.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 hover:bg-gray-200 rounded">
                        <Minus size={16} />
                      </button>
                      <span className="px-2 font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 hover:bg-gray-200 rounded">
                        <Plus size={16} />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full ml-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>Rp {getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Informasi Customer</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="customer_email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Pengiriman *
                  </label>
                  <textarea
                    id="shipping_address"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold">
                  {loading ? "Memproses Pesanan..." : `Pesan Sekarang - Rp ${getTotalPrice().toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
