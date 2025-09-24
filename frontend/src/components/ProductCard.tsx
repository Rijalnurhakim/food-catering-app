import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useCart } from "../hooks/useCart";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    console.log(`Added ${product.name} to cart`);
  };

  const handleQuickOrder = () => {
    addToCart(product);
  };

  const getPlaceholderImage = () => {
    return (
      "data:image/svg+xml;base64," +
      btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#6b7280" text-anchor="middle" dy=".3em">No Image</text>
      </svg>
    `)
    );
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = getPlaceholderImage();
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img src={product.image_url || getPlaceholderImage()} alt={product.name} className="w-full h-48 object-cover" onError={handleImageError} />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center mb-3">
          <span className="text-orange-600 font-bold text-xl">Rp {product.price.toLocaleString()}</span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.category}</span>
        </div>

        <div className="text-sm text-gray-500 mb-3">Stok: {product.stock}</div>

        <div className="flex justify-between items-center space-x-2">
          <Link to="/checkout" onClick={handleQuickOrder} className="flex-1 bg-orange-500 text-white text-center py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300 font-medium">
            Pesan Sekarang
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
            title="Tambah ke Keranjang"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
