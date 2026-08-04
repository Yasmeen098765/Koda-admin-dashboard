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
    <div className="p-6 bg-white border rounded-lg shadow-sm border-slate-200 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            {t("productDetails.productOverview")}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {product.name}
          </h2>
        </div>
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {product.category} / {product.subcategory}
        </span>
      </div>

      <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
        {product.description}
      </p>

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <div className="px-4 py-2 text-white rounded-lg bg-slate-900">
          {hasDiscount ? `${formattedDiscount} EGP` : `${formattedPrice} EGP`}
        </div>
        {hasDiscount && (
          <div className="px-4 py-2 text-sm font-semibold rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
            Save {(formattedPrice - formattedDiscount).toFixed(2)} EGP
          </div>
        )}
        {price > 0 && hasDiscount && (
          <span className="text-sm line-through text-slate-400">
            {formattedPrice} EGP
          </span>
        )}
      </div>

      <div className="grid gap-4 mt-6 md:grid-cols-3">
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/70">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <FaTag />
            <span className="text-sm font-semibold">
              {t("productDetails.brand")}
            </span>
          </div>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
            {product.brand}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/70">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <FaBox />
            <span className="text-sm font-semibold">
              {t("productDetails.stock")}
            </span>
          </div>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
            {product.stock > 0
              ? `${product.stock} ${t("productDetails.available")}`
              : t("productDetails.outOfStock")}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/70">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <FaStar />
            <span className="text-sm font-semibold">
              {t("productDetails.rating")}
            </span>
          </div>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
            {product.averageRating.toFixed(2) || 0} / 5
          </p>
        </div>
      </div>

      <div className="p-5 mt-6 border rounded-lg border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/70">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {t("productDetails.shortDescription")}
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
          {product.shortDescription}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {t("productDetails.reviews")}
        </h3>
        <div className="mt-4 space-y-3">
          {(product.reviews || []).slice(0, 3).map((review) => (
            <div
              key={review._id}
              className="p-4 bg-white border rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800/70"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {review.username}
                </p>
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300">
                  {review.rating} / 5
                </span>
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
