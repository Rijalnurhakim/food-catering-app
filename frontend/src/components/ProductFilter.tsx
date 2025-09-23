import React from "react";
import { Filter, SortAsc, SortDesc } from "lucide-react";

interface ProductFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortOption: string;
  onSortChange: (sort: string) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ categories, selectedCategory, onCategoryChange, sortOption, onSortChange }) => {
  // Tentukan icon berdasarkan sort option
  const getSortIcon = () => {
    if (sortOption === "price_asc") return <SortAsc size={20} className="text-gray-600" />;
    if (sortOption === "price_desc") return <SortDesc size={20} className="text-gray-600" />;
    return <SortAsc size={20} className="text-gray-600" />;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-600" />
          <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          {getSortIcon()}
          <select value={sortOption} onChange={(e) => onSortChange(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
