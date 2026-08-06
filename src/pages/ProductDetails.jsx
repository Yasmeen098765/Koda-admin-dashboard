// ProductDetails.jsx
import { useProduct } from "../Context/ProductContext";
import Slider from "../components/ProductDetails/Slider";
import ProductOverview from "../components/ProductDetails/ProductOverview";
import ProductNotFound from "../components/ProductDetails/ProductNotFound";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { FiPackage, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { ProductDetailsSkeleton } from "../components/Skeleton/ProductDetailsSkeleton/ProductDetailsSkeleton";
import useTheme from "../components/customHook/useTheme";
import { useLanguage } from "../Context/LanguageContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  const { product, loading, error, fetchProductById } = useProduct();

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  // Skeleton loading state
  if (loading) {
    const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
    const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

    return (
      <ProductDetailsSkeleton
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-3 xs:p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900">
        <div className="w-full max-w-md p-4 xs:p-5 sm:p-6 md:p-8 text-center border shadow-lg rounded-xl border-rose-200/50 dark:border-rose-800/50 bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-950/20 backdrop-blur-sm">
          <div className="flex justify-center mb-3 xs:mb-4">
            <div className="flex items-center justify-center w-14 h-14 xs:w-16 xs:h-16 text-white shadow-lg rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 shadow-rose-500/30">
              <FiPackage size={24} />
            </div>
          </div>
          <h3 className="mb-1.5 xs:mb-2 text-lg xs:text-xl md:text-2xl font-bold text-rose-700 dark:text-rose-400">
            {t("productDetails.notFound")}
          </h3>
          <p className="text-xs xs:text-sm text-rose-600 dark:text-rose-400/80 break-words">
            {error}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 mt-4 xs:mt-5 sm:mt-6 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold hover:from-cyan-600 hover:to-sky-600 transition-all shadow-lg shadow-cyan-500/30 text-sm xs:text-base w-full xs:w-auto"
          >
            <FiArrowLeft size={14} />
            <span className="hidden xs:inline">
              {t("productDetails.backToProducts")}
            </span>
            <span className="xs:hidden">
              {t("productDetails.backToProducts")}
            </span>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return <ProductNotFound />;
  }

  const imageUrls = Array.isArray(product.images)
    ? product.images
        .map((image) => (typeof image === "string" ? image : image?.url))
        .filter(Boolean)
    : [];

  return (
    <section className="min-h-screen p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 bg-slate-50/50 text-slate-900 dark:bg-slate-900 dark:text-slate-200">
      <div className="mx-auto max-w-[1600px] slide-up">
        {/* Header Section - محسّن للشاشات الصغيرة */}
        <div className="relative p-3 xs:p-4 sm:p-5 md:p-6 mb-4 xs:mb-5 sm:mb-6 md:mb-8 overflow-hidden transition-all duration-300 border shadow-lg rounded-xl border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:shadow-xl">
          <div className="absolute rounded-full -right-10 xs:-right-14 -top-10 xs:-top-14 h-32 xs:h-44 w-32 xs:w-44 bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5"></div>
          <div className="absolute bottom-0 left-0 rounded-full h-32 xs:h-44 w-32 xs:w-44 bg-blue-400/10 blur-3xl dark:bg-blue-500/5"></div>

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 text-white shadow-lg rounded-md sm:rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 shadow-cyan-500/30 shrink-0">
                  <FiPackage className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10  " />
                </div>
                <div className="min-w-0">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm font-medium transition-colors text-slate-500 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400"
                  >
                    <FiArrowLeft size={14} />
                    <span className="hidden xs:inline">
                      {t("productDetails.backToProducts")}
                    </span>
                    <span className="xs:hidden">
                      {t("productDetails.backToProducts")}
                    </span>
                  </Link>
                  <h1 className=" text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white truncate">
                    {product?.name || t("productDetails.detailsOverview")}
                  </h1>
                </div>
              </div>
              <span className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 lg:py-2 text-[11px] sm:text-[12px] md:text-xs lg:text-sm font-medium border rounded-lg border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 backdrop-blur-sm whitespace-nowrap">
                {t("productDetails.detailsOverview")}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid - محسّن للشاشات الصغيرة */}
        <div className="grid gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 grid-cols-[1fr] min-[870px]:grid-cols-[1fr_1.1fr] min-[1024px]:grid-cols-[1fr] min-[1200px]:grid-cols-[1fr_1.1fr]">
          {/* Slider Section */}
          <div className="p-2 sm:p-3 md:p-4 overflow-hidden transition-all duration-300 border shadow-lg rounded-xl border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:shadow-xl">
            <Slider images={imageUrls} />
          </div>

          {/* Product Details Section */}
          <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
            <div className="p-3 sm:p-4 md:p-5 lg:p-6 transition-all duration-300 border shadow-lg rounded-xl border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:shadow-xl">
              <ProductOverview product={product} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
