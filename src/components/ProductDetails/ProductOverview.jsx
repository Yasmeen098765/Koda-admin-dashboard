import { FaBox, FaStar, FaTag } from "react-icons/fa";
import { useProduct } from "../../Context/ProductContext";
import { useLanguage } from "../../Context/LanguageContext";

export default function ProductOveriew() {
  const { product, loading, error } = useProduct();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-sm text-slate-500">
        {t("productDetails.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600 rounded-lg shadow-sm bg-red-50">
        {error}
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const price = Number(product.price || 0);
  const discountPrice = Number(product.discountPrice || 0);
  const hasDiscount = discountPrice > 0 && discountPrice < price;
  const formattedPrice = price;
  const formattedDiscount = discountPrice;

  return (
    <div className="p-3 bg-white border rounded-lg shadow-sm xs:p-4 sm:p-5 md:p-6 border-slate-200 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-row justify-between gap-y-2 flex-wrap items-center gap-x-10 ">
        <div className="w-auto">
          <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-semibold uppercase tracking-[0.15em] xs:tracking-[0.2em] text-sky-600">
            {t("productDetails.productOverview")}
          </p>
          <h2 className="mt-1 text-lg font-bold break-words sm:mt-2 sm:text-xl md:text-2xl lg:text-3xl text-slate-900 dark:text-white">
            {product.name}
          </h2>
        </div>
        <span className="mt-2  px-2 sm:px-3 py-0.5 sm:py-1 text-[11px] md:text-sm lg:text-md font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 whitespace-nowrap w-max truncate">
          {product.category} {product.subcategory && `/ ${product.subcategory}`}
        </span>
      </div>

      <p className="mt-3 text-xs leading-5 sm:mt-3 md:mt-4 lg:mt-5 sm:text-sm md:text-base sm:leading-6 md:leading-7 text-slate-600 dark:text-slate-300">
        {product.description}
      </p>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 mt-3 sm:mt-4 md:mt-5 lg:mt-6">
        <div className="px-2  sm:px-2.5 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base text-white rounded-lg bg-slate-900">
          {hasDiscount ? `${formattedDiscount} EGP` : `${formattedPrice} EGP`}
        </div>
        {hasDiscount && (
          <>
            <div className="px-2 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold  rounded-md sm:rounded-lg md:rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
              Save {(formattedPrice - formattedDiscount).toFixed(2)} EGP
            </div>
            <span className="text-[10px] sm:text-xs md:text-sm line-through text-slate-400">
              {formattedPrice} EGP
            </span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mt-3 xs:mt-4 sm:mt-5 md:mt-6">
        {/* Brand */}
        <div className="p-2.5 md:p-3 sm:p-4 rounded-lg bg-slate-50 dark:bg-slate-800/70">
          <div className="flex items-center gap-1.5 xs:gap-2 text-slate-600 dark:text-slate-300">
            <FaTag className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
            <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-semibold">
              {t("productDetails.brand")}
            </span>
          </div>
          <p className="mt-0.5 sm:mt-1 md:mt-2 text-sm sm:text-base md:text-lg font-semibold text-slate-900 dark:text-white break-words">
            {product.brand || "-"}
          </p>
        </div>

        <div className="p-2.5 sm:p-3 md:p-4 rounded-lg bg-slate-50 dark:bg-slate-800/70">
          <div className="flex items-center gap-1.5 xs:gap-2 text-slate-600 dark:text-slate-300">
            <FaBox className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
            <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-semibold">
              {t("productDetails.stock")}
            </span>
          </div>
          <p
            className={`mt-0.5 sm:mt-1 md:mt-2 text-sm sm:text-base md:text-lg font-semibold ${
              product.stock > 0
                ? "text-slate-900 dark:text-white"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} ${t("productDetails.available")}`
              : t("productDetails.outOfStock")}
          </p>
        </div>

        <div className="p-2.5 sm:p-3 md:p-4 rounded-lg bg-slate-50 dark:bg-slate-800/70 min-[400px]:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 dark:text-slate-300">
            <FaStar className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
            <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-semibold">
              {t("productDetails.rating")}
            </span>
          </div>
          <p className="mt-0.5 sm:mt-1 md:mt-2 text-sm sm:text-base md:text-lg font-semibold text-slate-900 dark:text-white">
            {product.averageRating?.toFixed(2) || "0.00"} / 5
          </p>
        </div>
      </div>

      <div className="p-2.5 sm:p-3 md:p-4 lg:p-5 mt-3 sm:mt-4 md:mt-5 lg:mt-6 border rounded-lg border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/70">
        <h3 className="text-sm font-semibold sm:text-base md:text-lg text-slate-900 dark:text-white">
          {t("productDetails.shortDescription")}
        </h3>
        <p className="mt-0.5 sm:mt-1 md:mt-2 text-[10px] sm:text-xs md:text-sm leading-5 sm:leading-6 md:leading-7 text-slate-600 dark:text-slate-300">
          {product.shortDescription}
        </p>
      </div>

      <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-6">
        <h3 className="text-sm font-semibold sm:text-base md:text-lg text-slate-900 dark:text-white">
          {t("productDetails.reviews")}
        </h3>
        {product.reviews?.length > 0 ? (
          <div className="mt-2 space-y-2 sm:mt-3 md:space-y-3">
            {product.reviews.slice(0, 3).map((review) => (
              <div
                key={review._id}
                className="p-2.5 sm:p-3 md:p-4 bg-white border rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800/70"
              >
                <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2">
                  <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-900 dark:text-white break-words max-w-[60%] sm:max-w-[70%]">
                    {review.username}
                  </p>
                  <span className="px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300 whitespace-nowrap">
                    {review.rating} / 5
                  </span>
                </div>
                <p className="mt-0.5 sm:mt-1 md:mt-2 text-[10px] sm:text-xs md:text-sm leading-5 sm:leading-6 md:leading-7 text-slate-600 dark:text-slate-300 break-words">
                  {review.comment}
                </p>
              </div>
            ))}
            {product.reviews.length > 3 && (
              <button className="text-[10px] sm:text-xs md:text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">
                {t("productDetails.viewAllReviews")} ({product.reviews.length})
              </button>
            )}
          </div>
        ) : (
          <p className="mt-1.5 sm:mt-2 md:mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t("productDetails.noReviews")}
          </p>
        )}
      </div>
    </div>
  );
}
