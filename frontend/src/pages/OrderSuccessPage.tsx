import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, Printer, ArrowLeft } from "lucide-react";
import type { Order, OrderItem } from "../types";

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order;

  console.log("Order data received:", order);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">Please place an order first.</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const orderItems: OrderItem[] = order.order_items || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {" "}
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo untuk print */}
          <div className="print:flex print:items-center print:justify-between print:mb-6 hidden">
            <h1 className="text-2xl font-bold text-gray-800">BiteSwift</h1>
            <p className="text-gray-500 text-sm">Receipt #{order.id.toString().padStart(6, "0")}</p>
          </div>

          <CheckCircle size={80} className="mx-auto text-green-500 mb-4 print:hidden" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2 print:text-2xl">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg print:text-sm">
            Thank you for your order, <span className="font-semibold">{order.customer_name}</span>!
          </p>
          <p className="text-gray-500 print:text-xs">We've sent a confirmation email to {order.customer_email}</p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 print:shadow-none print:border print:border-gray-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <ShoppingBag size={24} className="text-blue-600 print:hidden" />
              <h2 className="text-xl font-semibold print:text-lg">Order Details</h2>
            </div>
            <button onClick={handlePrint} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2 print:hidden">
              <Printer size={16} />
              <span>Print Receipt</span>
            </button>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2 print:text-sm">Order Information</h3>
              <div className="space-y-1 text-sm print:text-xs">
                <p>
                  <span className="font-medium">Order ID:</span> #{order.id.toString().padStart(6, "0")}
                </p>
                <p>
                  <span className="font-medium">Order Date:</span>{" "}
                  {new Date(order.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>
                  <span className="font-medium">Status:</span> <span className="capitalize text-green-600 font-semibold">{order.status}</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2 print:text-sm">Customer Information</h3>
              <div className="space-y-1 text-sm print:text-xs">
                <p>
                  <span className="font-medium">Name:</span> {order.customer_name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {order.customer_email}
                </p>
                <p>
                  <span className="font-medium">Address:</span> {order.shipping_address}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 print:text-sm">Order Items</h3>
            {orderItems.length === 0 ? (
              <div className="text-center py-4 text-gray-500 print:text-xs">No items found in this order.</div>
            ) : (
              <div className="border rounded-lg print:border-gray-300">
                {orderItems.map((item: OrderItem, index: number) => (
                  <div key={item.id || index} className="flex justify-between items-center p-3 border-b last:border-b-0 print:border-b-gray-300">
                    <div className="flex-1">
                      <p className="font-medium print:text-sm">{item.product_name || `Product ${item.product_id}`}</p>
                      <p className="text-sm text-gray-600 print:text-xs">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600 print:text-xs">Price: Rp {(item.price_at_time || 0).toLocaleString()}</p>
                    </div>
                    <p className="font-semibold text-lg print:text-base">Rp {((item.price_at_time || 0) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t print:border-t-gray-300">
            <span className="text-lg font-semibold print:text-base">Total Amount:</span>
            <span className="text-2xl font-bold text-green-600 print:text-xl">Rp {order.total_amount?.toLocaleString() || "0"}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
          <Link to="/orders" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center font-semibold">
            View Order History
          </Link>
          <Link to="/" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 text-center font-semibold">
            Continue Shopping
          </Link>
          <button onClick={() => navigate(-1)} className="bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 text-center font-semibold border">
            Back to Previous
          </button>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm print:hidden">
          <p>Need help? Contact our support team at support@biteswift.com</p>
          <p>Your order will be prepared and delivered within 30-45 minutes.</p>
        </div>

        <div className="text-center mt-8 text-gray-500 text-xs hidden print:block">
          <p>Thank you for choosing BiteSwift!</p>
          <p>Contact: support@biteswift.com | Phone: (123) 456-7890</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
