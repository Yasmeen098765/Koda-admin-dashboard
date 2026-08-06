import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CartsSkeleton = ({ baseColor, highlightColor }) => {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <div className="min-h-screen overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 bg-slate-50/50 text-slate-900 dark:bg-slate-900">
        <div className="mx-auto max-w-[1600px] space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
          <div className="relative p-4 sm:p-5 md:p-6 overflow-hidden border shadow-xl rounded-xl border-slate-200 bg-white/90 dark:bg-slate-900 dark:border-slate-700 transition-all hover:shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute -right-10 -top-10 h-20 w-20 sm:h-32 sm:w-32 bg-cyan-400/5 blur-2xl"></div>
            <div className="absolute -left-10 -bottom-10 h-20 w-20 sm:h-32 sm:w-32 bg-blue-400/5 blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <Skeleton width={70} height={12} className="mb-1 sm:mb-2" />
                  <Skeleton width={180} height={24} className="mb-1 sm:mb-2" />
                </div>
                <Skeleton width={100} height={32} borderRadius={9999} />
              </div>
              <Skeleton width={300} height={16} className="mt-1 sm:mt-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <div
                  key={`stat-${index}`}
                  className="p-4 sm:p-5 bg-white border shadow-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton
                        width={60}
                        height={12}
                        className="mb-1 sm:mb-2"
                      />
                      <Skeleton width={50} height={28} />
                    </div>
                    <Skeleton circle width={40} height={40} />
                  </div>
                </div>
              ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
            <div className="p-6 sm:p-8 md:p-10 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all hover:bg-white/70 dark:hover:bg-slate-800/70">
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16">
                <Skeleton
                  circle
                  width={64}
                  height={64}
                  className="mb-3 sm:mb-4"
                />
                <Skeleton width={180} height={20} className="mb-1 sm:mb-2" />
                <Skeleton width={120} height={14} className="mb-4 sm:mb-5" />
                <Skeleton width={160} height={40} borderRadius={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export { CartsSkeleton };
