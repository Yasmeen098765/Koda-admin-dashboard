import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiPackage,
  FiPlus,
  FiSearch,
  FiSliders,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiStar,
  FiTrendingUp,
  FiBox,
  FiLayers,
  FiTag,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/api";
import { ProductsSkeleton } from "../components/Skeleton/ProductsSkeleton/ProductsSkeleton.jsx";
import useTheme from "../components/customHook/useTheme";
import { useLanguage } from "../Context/LanguageContext";
import QuickEdit from "./QuickEdit.jsx";

const categories = [
  "Electronics",
  "Phones",
  "Fashion",
  "Home",
  "Beauty",
  "Sports",
];

export default function Products() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    subcategory: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    category: "",
    subcategory: "",
  });

  // Delete Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [deletingId, setDeletingId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const stats = useMemo(() => {
    const featured = products.filter((p) => p.featured).length;
    const inStock = products.filter((p) => Number(p.stock) > 0).length;
    return {
      total: totalProducts || products.length,
      featured,
      inStock,
      outOfStock: products.filter((p) => Number(p.stock) <= 0).length,
    };
  }, [products, totalProducts]);

  useEffect(() => {
    let isSubscribed = true;
    setShowSkeleton(true);
    setLoading(true);

    const controller = new AbortController();
    async function loadProducts() {
      setError("");
      try {
        const params = {
          page,
          limit: 12,
          ...(appliedFilters.search && { search: appliedFilters.search }),
          ...(appliedFilters.category && { category: appliedFilters.category }),
          ...(appliedFilters.subcategory && {
            subcategory: appliedFilters.subcategory,
          }),
        };
        const endpoint = appliedFilters.subcategory
          ? "/products/search"
          : "/products";
        const { data } = await api.get(endpoint, {
          params,
          signal: controller.signal,
        });

        if (!isSubscribed) return;

        const rawProducts =
          data?.products || data?.data || (Array.isArray(data) ? data : []);
        const productList = Array.isArray(rawProducts) ? rawProducts : [];
        setProducts(productList);
        setTotalProducts(
          Number(
            data?.totalProducts ||
              data?.total ||
              data?.count ||
              productList.length,
          ) || 0,
        );
        setTotalPages(
          Number(
            data?.totalPages ||
              data?.pages ||
              Math.ceil(productList.length / 12),
          ) || 1,
        );
      } catch (err) {
        if (!isSubscribed) return;
        if (
          err?.code === "ERR_CANCELED" ||
          err?.name === "CanceledError" ||
          err?.name === "AbortError"
        ) {
          return;
        }
        setProducts([]);
        setError(err?.response?.data?.message || "Failed to load products.");
      } finally {
        if (isSubscribed) {
          setLoading(false);
          setTimeout(() => {
            if (isSubscribed) setShowSkeleton(false);
          }, 300);
        }
      }
    }
    loadProducts();
    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [appliedFilters, page, refreshKey]);

  const updateFilter = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));
  const applyFilters = () => {
    setPage(1);
    setAppliedFilters({ ...filters, search: filters.search.trim() });
  };

  const handleDeleteClick = (product) => {
    setUserToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${userToDelete._id}`);
      toast.success("Product deleted successfully");
      setDeleteModalOpen(false);
      setUserToDelete(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to delete product. Please check your permissions.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
    setDeleting(false);
  };

  if (showSkeleton || loading) {
    const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
    const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

    return (
      <ProductsSkeleton
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:p-6 lg:p-8 text-slate-900 bg-slate-50 dark:bg-slate-900 dark:text-slate-200">
      <div className="slide-up mx-auto max-w-[1600px] space-y-6 lg:space-y-8">
        <div className="flex flex-col items-start justify-between p-3 min-[400px]:p-6 transition-all duration-300 border shadow-lg rounded-xl sm:flex-row sm:items-center bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl">
          <div className="flex items-start gap-2 min-[400px]:gap-5">
            <div className="flex items-center justify-center rounded-lg shadow-lg w-10  min-[400px]:w-12 min-[640px]:w-15 h-10 min-[400px]:h-12 min-[640px]:h-15  shrink-0 bg-gradient-to-br from-cyan-500 to-sky-500 shadow-cyan-500/20">
              <FiPackage
                className="text-white w-6 h-6 min-[400px]:w-7 min-[400px]:h-7"
                strokeWidth={2}
              />
            </div>
            <div className="flex flex-col justify-center mb-6">
              <span className="text-[8px]  min-[270px]:text-[10px] min-[400px]:text-sm font-bold tracking-[0.25em] text-sky-500 dark:text-sky-400 uppercase  mb-1">
                {t("products.dashboard")}
              </span>
              <h1 className="text-sm  min-[400px]:text-xl  min-[500px]:text-2xl  min-[640px]:text-[29px] leading-none font-black text-slate-900 dark:text-white tracking-tight">
                {t("products.title")}
              </h1>
            </div>
          </div>
          <button
            onClick={() => navigate("/add-product")}
            className="flex text-sm min-[400px]:text-[15px] cursor-pointer items-center justify-center gap-2 px-3 min-[400px]:px-6 py-2.5 min-[400px]:py-3.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 active:scale-95 text-white  font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/30"
          >
            <FiPlus className="w-4 h-4  min-[400px]:w-5 min-[400px]:h-5 stroke-[2.5]" />
            {t("products.addProduct")}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[270px]:grid-cols-2 min-[700px]:grid-cols-4 lg:gap-6">
          <StatCard
            icon={<FiBox />}
            value={stats.total}
            label={t("products.total")}
            tone="cyan"
          />
          <StatCard
            icon={<FiStar />}
            value={stats.featured}
            label={t("products.featured")}
            tone="amber"
          />
          <StatCard
            icon={<FiTrendingUp />}
            value={stats.inStock}
            label={t("products.inStock")}
            tone="emerald"
          />
          <StatCard
            icon={<FiPackage />}
            value={stats.outOfStock}
            label={t("products.outOfStock")}
            tone="rose"
          />
        </div>

        <div className=" transition-all duration-300 border shadow-lg rounded-xl px-3 py-4 min-[400px]:p-6 border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 group">
              <FiSearch className="absolute  w-4 h-4 min-[400px]:w-5 min-[400px]:h-5 transition-colors -translate-y-1/2 left-4 min-[400px]:left-5 top-1/2 text-slate-700 z-[1] group-focus-within:text-cyan-500" />
              <input
                type="text"
                placeholder={t("products.searchPlaceholder")}
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="h-10  min-[400px]:h-13 z-[-1] w-full  rounded-md min-[400px]:rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50  pl-10 min-[400px]:pl-12  pr-2 min-[400px]:pr-4 text-xs min-[400px]:text-[15px] text-slate-900 dark:text-white outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-400 backdrop-blur-sm"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex flex-1  min-[400px]:flex-0 h-10 min-[400px]:h-13 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 min-[400px]:px-6  text-xs min-[400px]:text-sm  min-[500px]:text-[15px] font-semibold transition-all ${
                  filtersOpen
                    ? "border-cyan-500 bg-cyan-50 text-cyan-600 dark:border-cyan-500/50 dark:bg-cyan-500/20 dark:text-cyan-400"
                    : "border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 backdrop-blur-sm"
                }`}
              >
                <FiSliders className=" w-3 h-3 min-[400px]:w-4 min-[400px]:h-4" />
                {t("products.filters")}
              </button>
              <button
                onClick={applyFilters}
                className="flex flex-1  min-[400px]:flex-0  h-10 min-[400px]:h-13 cursor-pointer items-center justify-center  gap-1 min-[400px]:gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600  px-4 min-[400px]:px-8 text-xs  min-[400px]:text-sm min-[500px]:text-[15px] font-semibold text-white transition-all shadow-lg shadow-cyan-500/30"
              >
                {t("products.search")}
              </button>
            </div>
          </div>

          <div
            className={`grid transition-all duration-300 ease-in-out ${filtersOpen ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0"}`}
          >
            <div className="overflow-hidden">
              <div className="grid grid-cols-1 gap-5 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 sm:grid-cols-2">
                <FilterField label={t("products.category")} icon={<FiLayers />}>
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilter("category", e.target.value)}
                    className="h-10 min-[400px]:h-[52px] w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50  px-3 min-[400px]:px-4  text-xs min-[400px]:text-sm min-[500px]:text-[15px] text-slate-700 dark:text-white outline-none transition-colors hover:border-slate-300 dark:border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm"
                  >
                    <option value="">{t("products.allCategories")}</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </FilterField>

                <FilterField label={t("products.subcategory")} icon={<FiTag />}>
                  <input
                    type="text"
                    placeholder={t("products.subcategoryPlaceholder")}
                    value={filters.subcategory}
                    onChange={(e) =>
                      updateFilter("subcategory", e.target.value)
                    }
                    className="h-10  min-[400px]:h-13 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 px-3 min-[400px]:px-4  text-xs min-[400px]:text-sm min-[500px]:text-[15px] text-slate-700 dark:text-white outline-none transition-colors hover:border-slate-300 dark:border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-400 backdrop-blur-sm"
                  />
                </FilterField>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg min-[400px]:rounded-xl border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-950/30 p-4  min-[400px]:p-5 text-xs min-[400px]:text-sm min-[500px]:text-[15px] font-medium text-rose-700 dark:text-rose-400">
            {error}
          </div>
        )}

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 min-[500px]:grid-cols-2 min-[920px]:grid-cols-3 min-[1024px]:grid-cols-2 min-[1200px]:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isDeleting={deletingId === product._id}
                  onDelete={() => handleDeleteClick(product)}
                  onQuickEdit={() => {
                    setSelectedProduct(product);
                    setIsQuickEditOpen(true);
                  }}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8 pb-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex items-center justify-center w-10 h-10 transition-all border rounded-lg cursor-pointer border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-50 backdrop-blur-sm"
                >
                  <FiChevronLeft />
                </button>
                <span className="px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {t("products.page")} {page} {t("products.of")} {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center justify-center w-10 h-10 transition-all border rounded-lg cursor-pointer border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-50 backdrop-blur-sm"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-lg border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30">
            <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
              <FiPackage size={32} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
              {t("products.noProducts")}
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {t("products.tryAdjusting")}
            </p>
          </div>
        )}
      </div>

      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md p-4 mx-auto border rounded-lg shadow-2xl sm:p-6 bg-gradient-to-br from-white to-sky-200 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 border-slate-200/50 dark:border-slate-700/50">
            <h3 className="mb-2 font-bold text-md sm:text-xl text-slate-800 dark:text-white">
              {t("products.delete")}
            </h3>
            <p className="mb-4 text-sm sm:mb-6 sm:text-base text-slate-600 dark:text-slate-300">
              {t("users.deleteConfirm")}{" "}
              <strong className="break-words">{userToDelete.name}</strong>
              {t("users.cannotUndo")}
            </p>
            <div className="flex flex-col-reverse justify-end gap-2 min-[400px]:flex-row min-[400px]:gap-3">
              <button
                onClick={handleCancelDelete}
                className="w-full sm:w-auto px-4 sm:px-6  py-2 min-[400px]:py-2.5 text-xs min-[400px]:text-sm font-bold rounded-md min-[400px]:rounded-lg cursor-pointer text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:hover:border-slate-600 transition-all duration-200 shadow-sm hover:shadow order-2 sm:order-1"
              >
                {t("users.cancelBtn")}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 min-[400px]:py-2.5 text-xs min-[400px]:text-sm font-bold rounded-md min-[400px]:rounded-lg cursor-pointer bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 order-1 sm:order-2"
              >
                {deleting && (
                  <FiLoader className="flex-shrink-0 w-4 h-4 animate-spin" />
                )}
                {t("users.deleteBtn")}
              </button>
            </div>
          </div>
        </div>
      )}

      {isQuickEditOpen && selectedProduct && (
        <QuickEdit
          product={selectedProduct}
          onClose={() => setIsQuickEditOpen(false)}
          onSuccess={() => {
            setIsQuickEditOpen(false);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}

function StatCard({ icon, value, label, tone, className = "" }) {
  const tones = {
    cyan: "bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30",
    amber:
      "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30",
    emerald:
      "bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-lg shadow-emerald-500/30",
    rose: "bg-gradient-to-br from-rose-400 to-red-500 text-white shadow-lg shadow-rose-500/30",
  };

  return (
    <div
      className={`flex flex-col rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-3 min-[400px]:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}
    >
      <div
        className={`mb-3 min-[400px]:mb-5 flex h-8 w-8 min-[400px]:h-12 min-[400px]:w-12 items-center justify-center rounded-lg text-xl ${tones[tone]}`}
      >
        {icon}
      </div>
      <h3 className="text-xl min-[400px]:text-2xl  min-[500px]:text-[32px] font-black tracking-tight text-slate-900 dark:text-white leading-none">
        {value}
      </h3>
      <p className="mt-2 text-[14px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}

function FilterField({ label, icon, children }) {
  return (
    <div className="flex flex-col gap-2 min-[400px]:gap-2.5">
      <label className="flex items-center gap-2 text-[10px] min-[400px]:text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
        {icon && (
          <span className="text-slate-400 dark:text-slate-500">{icon}</span>
        )}
        {label}
      </label>
      {children}
    </div>
  );
}

function ProductCard({ product, isDeleting, onDelete, onQuickEdit }) {
  const { t } = useLanguage();
  const stock = Number(product.stock) || 0;

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isDeleting ? "opacity-60 grayscale" : ""}`}
    >
      <div className="relative w-full overflow-hidden aspect-4/3 shrink-0 bg-slate-50 dark:bg-slate-950">
        <ImageSlider
          images={product.images?.map((img) => img.url || img)}
          altText={product.name}
        />

        {product.featured && (
          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-amber-500/30 z-10">
            <FiStar size={12} className="fill-white" /> {t("products.featured")}
          </div>
        )}

        <div
          className={`absolute bottom-4 right-4 rounded-lg px-3 py-1.5 text-[12px] font-bold shadow-lg z-10 ${
            stock > 0
              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30"
              : "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/30"
          }`}
        >
          {stock > 0
            ? `${stock} ${t("products.inStockCount")}`
            : t("products.outOfStock")}
        </div>
      </div>

      <div className="flex flex-col flex-1 px-3 min-[400px]:px-6 min-[500px]:px-4  min-[700px]:px-6  pt-5 pb-6">
        <Link
          to={`/products/${product._id}`}
          className="text-md min-[400px]:text-[19px] font-extrabold text-slate-900 dark:text-white transition-colors hover:text-cyan-500 line-clamp-1"
        >
          {product.name}
        </Link>

        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          {[product.category, product.subcategory, product.brand]
            .filter(Boolean)
            .join(" · ")}
        </p>

        <p className="mt-2  min-[400px]:mt-3 line-clamp-1 text-[14px] text-slate-500 dark:text-slate-400">
          {product.shortDescription ||
            product.description ||
            t("products.noDescription")}
        </p>

        <div className="pt-3 min-[400px]:pt-5 mt-auto">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-lg min-[400px]:text-[19px] min-[1000px]:text-[23px] font-black tracking-tight text-slate-900 dark:text-white">
              {(Number(product.price) || 0).toFixed(0)}{" "}
              <span className="text-sm  min-[400px]:text-[16px] font-bold text-slate-500 dark:text-slate-400 tracking-normal ml-1">
                EGP
              </span>
            </span>
            {(Number(product.discountPrice) || Number(product.discount) || 0) >
              0 && (
              <span className="text-sm  min-[400px]:text-[14px] font-semibold text-emerald-500 dark:text-emerald-400">
                -
                {(
                  Number(product.discountPrice) ||
                  Number(product.discount) ||
                  0
                ).toFixed(0)}{" "}
                EGP off
              </span>
            )}
          </div>

          <div className="mt-3.5 flex flex-wrap gap-2">
            {product.tags?.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-lg border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-3 py-1 text-[12px] font-medium text-slate-600 dark:text-slate-300 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2.5 min-[400px]:gap-2 pt-5 mt-3 min-[400px]:mt-6 border-t border-slate-300 dark:border-slate-700">
          <div className="flex flex-wrap flex-1 w-full gap-3">
            <ActionBtn
              icon={<FiEye />}
              label={t("products.view")}
              to={`/products/${product._id}`}
              className="flex items-center justify-center flex-1"
            />
            <ActionBtn
              icon={<FiEdit2 />}
              label={t("products.edit")}
              to={`/products/${product._id}/edit`}
              className="flex items-center justify-center flex-1"
            />
          </div>
          <div className="flex  flex-row  min-[500px]:flex-col  min-[610px]:flex-row  flex-wrap flex-1 w-full gap-3">
            <button
              type="button"
              onClick={onQuickEdit}
              className="flex items-center justify-center flex-1 cursor-pointer gap-0.5 min-[400px]:gap-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-2.5 min-[400px]:px-3.5 py-2 min-[400px]:py-2 text-[10.5px] min-[400px]:text-[12px] font-semibold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 backdrop-blur-sm"
            >
              <FiSliders className="text-[10px] min-[400px]:text-[12px]" />{" "}
              {t("products.quickEdit")}
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={onDelete}
              className="flex items-center justify-center flex-1 cursor-pointer items-center gap-1 min-[400px]:gap-1.5 rounded-lg border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-950/30 px-2.5 min-[400px]:px-3.5 py-2 min-[400px]:py-2 text-[10.5px] min-[400px]:text-[12px] font-semibold text-rose-600 dark:text-rose-400 transition-all hover:bg-rose-100 dark:hover:bg-rose-950/50 disabled:opacity-50"
            >
              <FiTrash2 className="text-[10px] min-[400px]:text-[12px]" />
              <span>{isDeleting ? "..." : t("products.delete")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, to, className = "" }) {
  const content = (
    <>
      <span className="text-slate-400 dark:text-slate-500">{icon}</span>
      <span>{label}</span>
    </>
  );

  const baseClass =
    "flex items-center gap-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-3.5 py-2 text-[12px] font-semibold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-sm backdrop-blur-sm " +
    className;

  if (to) {
    return (
      <Link to={to} className={baseClass}>
        {content}
      </Link>
    );
  }
  return <button className={baseClass}>{content}</button>;
}

function ImageSlider({ images, altText }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const displayImages =
    images?.length > 0
      ? images
      : ["https://placehold.co/600x450/f8fafc/94a3b8?text=No+Image"];

  const goToNext = (e) => {
    if (e) e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const goToPrev = (e) => {
    if (e) e.preventDefault();
    setCurrentIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length,
    );
  };

  useEffect(() => {
    if (isHovered || displayImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered, displayImages.length]);

  return (
    <div
      className="relative w-full h-full group/slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {displayImages.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`${altText} - ${idx}`}
            className="object-cover w-full h-full shrink-0"
          />
        ))}
      </div>

      {displayImages.length > 1 && isHovered && (
        <>
          <button
            onClick={goToPrev}
            className="absolute z-20 flex items-center justify-center w-8 h-8 transition-all -translate-y-1/2 rounded-full shadow-sm cursor-pointer left-3 top-1/2 bg-white/90 text-slate-800 hover:bg-white hover:scale-105"
          >
            <FiChevronLeft size={16} />
          </button>
          <button
            onClick={goToNext}
            className="absolute z-20 flex items-center justify-center w-8 h-8 transition-all -translate-y-1/2 rounded-full shadow-sm cursor-pointer right-3 top-1/2 bg-white/90 text-slate-800 hover:bg-white hover:scale-105"
          >
            <FiChevronRight size={16} />
          </button>
        </>
      )}

      {displayImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {displayImages.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                idx === currentIndex ? "bg-cyan-500" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
