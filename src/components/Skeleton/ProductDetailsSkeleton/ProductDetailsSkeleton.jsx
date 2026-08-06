import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductDetailsSkeleton = ({ baseColor, highlightColor }) => {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <section className="min-h-screen overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-900">
        <div className="mx-auto max-w-[1600px] space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
          <div className="relative overflow-hidden rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-4 sm:p-5 md:p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="absolute -right-10 -top-10 h-20 w-20 sm:h-32 sm:w-32 bg-cyan-400/10 blur-3xl"></div>
            <div className="absolute -left-10 -bottom-10 h-20 w-20 sm:h-32 sm:w-32 bg-blue-400/10 blur-3xl"></div>

            <div className="relative z-10 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <Skeleton circle width={44} height={44} className="shrink-0" />
                <div>
                  <Skeleton
                    width={100}
                    height={16}
                    borderRadius={8}
                    className="mb-0.5 sm:mb-1"
                  />
                  <Skeleton
                    width={120}
                    height={28}
                    borderRadius={8}
                    className="mt-0.5 sm:mt-1"
                  />
                </div>
              </div>

              <Skeleton
                width={140}
                height={36}
                borderRadius={12}
                className="shrink-0 self-start sm:self-auto"
              />
            </div>
            <Skeleton
              width="60%"
              height={14}
              borderRadius={4}
              className="relative z-10 mt-2 sm:mt-3"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10">
            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-3 sm:p-4 shadow-lg aspect-square min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
                <Skeleton height="100%" borderRadius={16} className="w-full" />
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 p-1 sm:p-2 aspect-square"
                    >
                      <Skeleton height="100%" borderRadius={12} />
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
              <div className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-4 sm:p-5 md:p-6 shadow-lg transition-all hover:shadow-xl">
                <Skeleton
                  width="90%"
                  height={30}
                  borderRadius={8}
                  className="mb-2 sm:mb-3"
                />

                <div className="flex items-baseline gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Skeleton width={120} height={28} borderRadius={8} />
                  <Skeleton width={80} height={20} borderRadius={8} />
                </div>

                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Skeleton width={100} height={20} borderRadius={8} />
                  <Skeleton width={80} height={16} borderRadius={8} />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Skeleton width="100%" height={14} borderRadius={4} />
                  <Skeleton width="95%" height={14} borderRadius={4} />
                  <Skeleton width="90%" height={14} borderRadius={4} />
                  <Skeleton width="85%" height={14} borderRadius={4} />
                  <Skeleton width="88%" height={14} borderRadius={4} />
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mt-3 sm:mt-4">
                  <Skeleton width={80} height={28} borderRadius={12} />
                  <Skeleton width={100} height={28} borderRadius={12} />
                  <Skeleton width={70} height={28} borderRadius={12} />
                  <Skeleton width={90} height={28} borderRadius={12} />
                </div>

                <Skeleton width="100%" height={1} className="my-3 sm:my-4" />

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Skeleton width="100%" height={48} borderRadius={12} />
                  <Skeleton width="100%" height={48} borderRadius={12} />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <div className="p-2 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <Skeleton width="60%" height={12} className="mb-1" />
                    <Skeleton width="40%" height={16} />
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <Skeleton width="60%" height={12} className="mb-1" />
                    <Skeleton width="40%" height={16} />
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                  <Skeleton width="70%" height={12} borderRadius={4} />
                  <Skeleton width="60%" height={12} borderRadius={4} />
                  <Skeleton width="50%" height={12} borderRadius={4} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SkeletonTheme>
  );
};

export { ProductDetailsSkeleton };
