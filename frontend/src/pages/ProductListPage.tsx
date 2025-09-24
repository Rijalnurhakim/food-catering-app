import React, { useState, useEffect } from "react";
import type { Product } from "../types";
import { productService } from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductFilter from "../components/ProductFilter";

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>(""); // Tambah state search
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Update filtered products when filters change
  useEffect(() => {
    let result = products;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((product) => product.name.toLowerCase().includes(term) || product.description.toLowerCase().includes(term));
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((product) => product.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Apply sorting
    if (sortOption === "price_asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price_desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else {
      result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, sortOption, searchTerm]); // Tambah searchTerm ke dependency

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map((p) => p.category)));
      setCategories(uniqueCategories);
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Menu</h1>
      <p className="text-gray-600 mb-6">Delicious catering options for every occasion</p>

      {/* Filters */}
      <ProductFilter categories={categories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} sortOption={sortOption} onSortChange={setSortOption} searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No products found{selectedCategory && ` in category "${selectedCategory}"`}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
