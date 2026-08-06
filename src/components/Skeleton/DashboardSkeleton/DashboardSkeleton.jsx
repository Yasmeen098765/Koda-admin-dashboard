import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CardsSkeleton = ({ baseColor, highlightColor }) => {
  const cards = Array(6).fill(null);

  const content = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 my-4 sm:my-6 md:my-8">
      {cards.map((_, index) => (
        <div
          key={index}
          className="p-3 sm:p-4 md:p-5 lg:p-6 bg-white border shadow-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl transition-all hover:shadow-md"
        >
          <div className="mb-2 sm:mb-3">
            <Skeleton
              circle
              width={40}
              height={40}
              className="skeleton-card-icon"
            />
          </div>
          <h4 className="mt-2 sm:mt-3">
            <Skeleton width={80} height={12} />
          </h4>
          <h2 className="mt-1 sm:mt-2">
            <Skeleton width={100} height={24} />
          </h2>
          <p className="mt-1 sm:mt-2">
            <Skeleton width={70} height={10} />
          </p>
        </div>
      ))}
    </div>
  );

  if (baseColor && highlightColor) {
    return (
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        {content}
      </SkeletonTheme>
    );
  }

  return content;
};

const OrderStatusSkeleton = ({ baseColor, highlightColor }) => {
  const statuses = [
    "pending",
    "processing",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const content = (
    <div className="rounded-xl overflow-x-hidden  border border-slate-200 bg-white/90 p-4 sm:p-5 md:p-6 shadow-xl min-h-[400px] sm:min-h-[450px] md:min-h-[520px] dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
        <div>
          <Skeleton width={120} height={12} className="mb-1 sm:mb-2" />
          <Skeleton width={160} height={20} />
        </div>
        <Skeleton width={100} height={28} borderRadius={9999} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {statuses.map((status) => (
          <div
            key={status}
            className="border rounded-[22px] p-4 sm:p-5 md:p-6 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
          >
            <Skeleton width={70} height={12} className="mb-2 sm:mb-3" />
            <Skeleton width={50} height={28} />
          </div>
        ))}
      </div>
    </div>
  );

  if (baseColor && highlightColor) {
    return (
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        {content}
      </SkeletonTheme>
    );
  }

  return content;
};

const BestSellerSkeleton = ({ baseColor, highlightColor }) => {
  const products = Array(4).fill(null);

  const content = (
    <div className="p-4 sm:p-5 md:p-6 border shadow-xl bg-white/90 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
      <Skeleton width={100} height={18} className="mb-4 sm:mb-5 md:mb-6" />

      {products.map((_, index) => (
        <div
          key={index}
          className="p-3 overflow-x-hidden sm:p-4 mb-2 sm:mb-3 border shadow-sm bg-white/90 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900/90 last:mb-0 transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <Skeleton width={50} height={50} borderRadius={12} />
            <div className="flex-1 min-w-0">
              <Skeleton width={120} height={14} className="mb-1 sm:mb-2" />
              <Skeleton width={70} height={12} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (baseColor && highlightColor) {
    return (
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        {content}
      </SkeletonTheme>
    );
  }

  return content;
};

const RecentOrdersSkeleton = ({ baseColor, highlightColor }) => {
  const orders = Array(5).fill(null);

  const content = (
    <div className="p-4 overflow-x-hidden sm:p-5 md:p-6 mt-6 sm:mt-7 md:mt-8 border shadow-xl rounded-xl border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <Skeleton width={120} height={12} className="mb-1 sm:mb-2" />
          <Skeleton width={160} height={20} />
        </div>
        <Skeleton width={80} height={28} borderRadius={9999} />
      </div>

      <div className="space-y-3 sm:space-y-4">
        {orders.map((_, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 md:px-6 py-4 sm:py-5 border rounded-xl border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex-1 min-w-0">
              <Skeleton width={140} height={18} className="mb-1 sm:mb-2" />
              <Skeleton width={180} height={12} />
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6">
              <Skeleton width={70} height={24} borderRadius={9999} />
              <Skeleton width={90} height={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (baseColor && highlightColor) {
    return (
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        {content}
      </SkeletonTheme>
    );
  }

  return content;
};

const DashboardSkeleton = ({ baseColor, highlightColor }) => {
  const content = (
    <section className="p-3 overflow-x-hidden sm:p-4 md:p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      <div className="mx-auto max-w-[1600px] space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
        <div className="p-4 sm:p-5 md:p-6 lg:p-8 bg-white/90 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <Skeleton width={120} height={12} className="mb-1 sm:mb-2" />
          <Skeleton width={150} height={24} className="mb-1 sm:mb-2" />
          <Skeleton width={180} height={16} />
        </div>

        <CardsSkeleton baseColor={baseColor} highlightColor={highlightColor} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          <div className="lg:col-span-2">
            <OrderStatusSkeleton
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
          </div>
          <div className="lg:col-span-1">
            <BestSellerSkeleton
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
          </div>
        </div>

        <RecentOrdersSkeleton
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
      </div>
    </section>
  );

  if (baseColor && highlightColor) {
    return (
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        {content}
      </SkeletonTheme>
    );
  }

  return content;
};

export {
  DashboardSkeleton,
  CardsSkeleton,
  OrderStatusSkeleton,
  BestSellerSkeleton,
  RecentOrdersSkeleton,
};
