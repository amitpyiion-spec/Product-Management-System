import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getProduct,
  createProduct,
  updateProduct,
} from "../services/productApi";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  // =========================
  // GET PRODUCT FOR EDIT
  // =========================

  const {
    data,
    isLoading: productLoading,
    isError: productError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: isEdit,
  });

  // Fill form when editing
  useEffect(() => {
    if (data?.product) {
      const product = data.product;

      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        stock: product.stock ?? "",
      });
    }
  }, [data]);

  // =========================
  // CREATE
  // =========================

  const createMutation = useMutation({
    mutationFn: createProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      navigate("/");
    },
  });

  // =========================
  // UPDATE
  // =========================

  const updateMutation = useMutation({
    mutationFn: (product) => updateProduct(id, product),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["product", id],
      });

      navigate("/");
    },
  });

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear only this field's error
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Product name must be at least 2 characters";
    }

    if (form.price === "") {
      newErrors.price = "Price is required";
    } else if (Number(form.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!form.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (form.stock === "") {
      newErrors.stock = "Stock is required";
    } else if (Number(form.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    setErrors({
      name: newErrors.name || "",
      price: newErrors.price || "",
      category: newErrors.category || "",
      stock: newErrors.stock || "",
    });

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: Number(form.stock),
    };

    if (isEdit) {
      updateMutation.mutate(productData);
    } else {
      createMutation.mutate(productData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // =========================
  // LOADING EDIT PRODUCT
  // =========================

  if (isEdit && productLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (isEdit && productError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">Failed to load product.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-xl mx-auto">
        {/* Header */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Update Product" : "Add Product"}
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {isEdit
              ? "Update the product information below."
              : "Add a new product to your inventory."}
          </p>
        </div>

        {/* Form Card */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Product Name */}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Product Name <span className="text-red-500">*</span>
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Mouse"
                className={`w-full px-3 py-2.5 rounded-lg border outline-none transition
                  ${
                    errors.name
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
              />

              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Description <span className="text-gray-400"> (Optional)</span>
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="3"
                className={`w-full px-3 py-2.5 rounded-lg border outline-none resize-none transition
                  ${
                    errors.description
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
              />

              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Price / Category / Stock */}

            <div className="grid grid-cols-3 gap-3">
              {/* Price */}

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Price <span className="text-red-500">*</span>
                </label>

                <input
                  id="price"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="799"
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2.5 rounded-lg border outline-none transition
                    ${
                      errors.price
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                />

                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                )}
              </div>

              {/* Category */}

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Category <span className="text-red-500">*</span>
                </label>

                <input
                  id="category"
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Electronics"
                  className={`w-full px-3 py-2.5 rounded-lg border outline-none transition
                    ${
                      errors.category
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                />

                {errors.category && (
                  <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                )}
              </div>

              {/* Stock */}

              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Stock <span className="text-red-500">*</span>
                </label>

                <input
                  id="stock"
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="25"
                  min="0"
                  className={`w-full px-3 py-2.5 rounded-lg border outline-none transition
                    ${
                      errors.stock
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                />

                {errors.stock && (
                  <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
                )}
              </div>
            </div>

            {/* API Error */}

            {(createMutation.isError || updateMutation.isError) && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3">
                {createMutation.error?.response?.data?.message ||
                  updateMutation.error?.response?.data?.message ||
                  "Something went wrong. Please try again."}
              </p>
            )}

            {/* Buttons */}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                    ? "Update Product"
                    : "Add Product"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
