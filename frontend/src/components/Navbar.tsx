import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, History } from "lucide-react";
import { useCart } from "../hooks/useCart";

const Navbar: React.FC = () => {
  const { getTotalItems } = useCart();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            BiteSwift
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/orders" className="flex items-center space-x-1 hover:text-blue-200">
              <History size={20} />
              <span>Orders</span>
            </Link>

            <Link to="/checkout" className="flex items-center space-x-1 hover:text-blue-200">
              <ShoppingCart size={20} />
              <span>Cart ({getTotalItems()})</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
