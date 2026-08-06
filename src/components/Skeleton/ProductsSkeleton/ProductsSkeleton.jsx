import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductsSkeleton = ({ baseColor, highlightColor }) => {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <div className="min-h-screen overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-900">
        <div className="mx-auto max-w-[1600px] space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 md:p-6 rounded-[28px] bg-white shadow-sm dark:bg-slate-900 gap-3 sm:gap-4 border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
              <Skeleton circle width={48} height={48} />
              <div>
                <Skeleton width={120} height={12} className="mb-1 sm:mb-2" />
                <Skeleton width={160} height={28} />
              </div>
            </div>
            <Skeleton width={160} height={44} borderRadius={16} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white p-4 sm:p-5 md:p-6 shadow-sm dark:bg-slate-900 transition-all hover:shadow-md"
                >
                  <div className="mb-3 sm:mb-4 md:mb-5 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                    <Skeleton circle width={20} height={20} />
                  </div>
                  <Skeleton width={70} height={28} className="mb-1 sm:mb-2" />
                  <Skeleton width={50} height={12} />
                </div>
              ))}
          </div>

          <div className="rounded-[28px] bg-white p-4 sm:p-5 md:p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-700 transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Skeleton height={48} borderRadius={16} />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Skeleton width="100%" height={48} borderRadius={16} />
                <Skeleton width="100%" height={48} borderRadius={16} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col overflow-hidden rounded-xl sm:rounded-4xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm dark:bg-slate-900 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Skeleton height="100%" />

                    <div className="absolute left-3 sm:left-4 top-3 sm:top-4 z-10">
                      <Skeleton width={80} height={26} borderRadius={9999} />
                    </div>
                    <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10">
                      <Skeleton width={70} height={26} borderRadius={9999} />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 pt-3 sm:pt-4 md:pt-5 dark:bg-slate-900">
                    {/* Title */}
                    <Skeleton
                      width="80%"
                      height={20}
                      className="mb-1 sm:mb-2"
                    />
                    <Skeleton
                      width="60%"
                      height={12}
                      className="mb-2 sm:mb-3"
                    />
                    <Skeleton
                      width="90%"
                      height={14}
                      className="mb-3 sm:mb-4"
                    />

                    <div className="mt-auto pt-3 sm:pt-4 md:pt-5">
                      <div className="flex items-baseline gap-2">
                        <Skeleton width={90} height={28} />
                        <Skeleton width={70} height={16} />
                      </div>

                      <div className="mt-2.5 sm:mt-3 md:mt-3.5 flex flex-wrap gap-1.5 sm:gap-2">
                        <Skeleton width={50} height={24} borderRadius={12} />
                        <Skeleton width={60} height={24} borderRadius={12} />
                        <Skeleton width={45} height={24} borderRadius={12} />
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-5 md:mt-6 flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 sm:pt-5">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        <Skeleton width={70} height={32} borderRadius={14} />
                        <Skeleton width={60} height={32} borderRadius={14} />
                        <Skeleton width={90} height={32} borderRadius={14} />
                      </div>
                      <Skeleton width={60} height={32} borderRadius={14} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export { ProductsSkeleton };
