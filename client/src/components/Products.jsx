import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
  getProducts,
  deleteProduct,
} from "../services/productApi";

const Products = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // =========================
  // FILTER STATE
  // =========================

  const [searchTerm, setSearchTerm] = useState("");
  const [fromPrice, setFromPrice] = useState("");
  const [toPrice, setToPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [appliedFromPrice, setAppliedFromPrice] = useState("");
  const [appliedToPrice, setAppliedToPrice] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("All Categories");

  // =========================
  // GET PRODUCTS
  // =========================

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products = data?.products || [];

  // =========================
  // GET AVAILABLE CATEGORIES
  // =========================

  const availableCategories = useMemo(() => {
    const categories = new Set(products.map(p => p.category));
    return ["All Categories", ...Array.from(categories)];
  }, [products]);

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchesSearch = product.name
        .toLowerCase()
        .includes(appliedSearchTerm.toLowerCase());

      // Price filter
      const priceNum = Number(product.price);
      const fromPriceNum = appliedFromPrice === "" ? 0 : Number(appliedFromPrice);
      const toPriceNum = appliedToPrice === "" ? Infinity : Number(appliedToPrice);
      const matchesPrice = priceNum >= fromPriceNum && priceNum <= toPriceNum;

      // Category filter
      const matchesCategory =
        appliedCategory === "All Categories" ||
        product.category === appliedCategory;

      return matchesSearch && matchesPrice && matchesCategory;
    });
  }, [products, appliedSearchTerm, appliedFromPrice, appliedToPrice, appliedCategory]);

  // =========================
  // APPLY FILTERS
  // =========================

  const handleApplyFilters = () => {
    setAppliedSearchTerm(searchTerm);
    setAppliedFromPrice(fromPrice);
    setAppliedToPrice(toPrice);
    setAppliedCategory(selectedCategory);
  };

  // =========================
  // CLEAR FILTERS
  // =========================

  const handleClearFilters = () => {
    setSearchTerm("");
    setFromPrice("");
    setToPrice("");
    setSelectedCategory("All Categories");
    setAppliedSearchTerm("");
    setAppliedFromPrice("");
    setAppliedToPrice("");
    setAppliedCategory("All Categories");
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // =========================
  // DELETE HANDLER
  // =========================

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    deleteMutation.mutate(id);
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">
          Failed to load products.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">

      <div className="max-w-6xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex items-center justify-between mb-6">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Products Management System
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your products and inventory.
            </p>
          </div>

          <button
            onClick={() => navigate("/products/add")}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + Add Product
          </button>

        </div>

        {/* =========================
            SEARCH SECTION
        ========================= */}

        <div className="mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search products
            </label>
            <div className="relative max-w-md">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
              />
            </div>
          </div>
        </div>

        {/* =========================
            FILTER SECTION
        ========================= */}

        <div className="mb-6">
          
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Filters
            </h3>
            {/* <button
              onClick={handleClearFilters}
              className="px-2 py-1 text-xs text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-100 rounded transition"
            >
              Clear Filters
            </button> */}
          </div>

          {/* Filter Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 max-w-2xl">

            {/* From Price */}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                From Price
              </label>
              <input
                type="number"
                placeholder="Min"
                value={fromPrice}
                onChange={(e) => setFromPrice(e.target.value)}
                min="0"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
              />
            </div>

            {/* To Price */}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                To Price
              </label>
              <input
                type="number"
                placeholder="Max"
                value={toPrice}
                onChange={(e) => setToPrice(e.target.value)}
                min="0"
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
              />
            </div>

            {/* Category Dropdown */}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
              >
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-1.5 text-sm text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Clear
            </button>
          </div>

        </div>

        {/* =========================
            RESULTS COUNTER
        ========================= */}

        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{products.length}</span> products
          </p>
        </div>


        {/* =========================
            PRODUCT TABLE
        ========================= */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          {filteredProducts.length === 0 ? (

            // EMPTY STATE

            <div className="p-10 text-center">

              {products.length === 0 ? (
                <>
                  <h2 className="text-lg font-semibold text-gray-800">
                    No products found
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 mb-5">
                    Start by adding your first product.
                  </p>

                  <button
                    onClick={() => navigate("/products/add")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add Product
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-gray-800">
                    No products match your filters
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 mb-5">
                    Try adjusting your search criteria.
                  </p>

                  <button
                    onClick={handleClearFilters}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                </>
              )}

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                {/* TABLE HEADER */}

                <thead>
                  <tr className="bg-gray-50 border-b">

                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-700">
                      Product
                    </th>

                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-700">
                      Description
                    </th>

                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-700">
                      Price
                    </th>

                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-700">
                      Category
                    </th>

                    <th className="text-left px-5 py-3 text-sm font-semibold text-gray-700">
                      Stock
                    </th>

                    <th className="text-center px-5 py-3 text-sm font-semibold text-gray-700">
                      Actions
                    </th>

                  </tr>
                </thead>

                {/* TABLE BODY */}

                <tbody>

                  {filteredProducts.map((product) => (

                    <tr
                      key={product.id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >

                      {/* NAME */}

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                      </td>

                      {/* DESCRIPTION */}

                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-sm text-gray-600 truncate">
                          {product.description}
                        </p>
                      </td>

                      {/* PRICE */}

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          ₹{product.price}
                        </p>
                      </td>

                      {/* CATEGORY */}

                      <td className="px-5 py-4">
                        <span className="inline-block bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-medium">
                          {product.category}
                        </span>
                      </td>

                      {/* STOCK */}

                      <td className="px-5 py-4">

                        <span
                          className={`text-sm font-medium ${
                            product.stock === 0
                              ? "text-red-500"
                              : product.stock < 10
                              ? "text-orange-500"
                              : "text-green-600"
                          }`}
                        >
                          {product.stock}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-center gap-2">

                          {/* EDIT */}

                          <button
                            onClick={() =>
                              navigate(
                                `/products/edit/${product.id}`
                              )
                            }
                            className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                          >
                            Edit
                          </button>

                          {/* DELETE */}

                          <button
                            onClick={() =>
                              handleDelete(product.id)
                            }
                            disabled={deleteMutation.isPending}
                            className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Products;