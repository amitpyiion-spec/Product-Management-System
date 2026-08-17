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
            PRODUCT TABLE
        ========================= */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          {products.length === 0 ? (

            // EMPTY STATE

            <div className="p-10 text-center">

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

                  {products.map((product) => (

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