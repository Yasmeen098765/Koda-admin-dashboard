import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AddProductSkeleton = ({ baseColor, highlightColor }) => {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <main className="min-h-screen overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 bg-slate-50/50 text-slate-900 mx-auto max-w-[1600px] dark:bg-slate-950">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 shadow-sm transition-all hover:shadow-md">
          <div className="relative z-10 flex flex-col gap-4 sm:gap-5 md:gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full">
              <Skeleton
                width={140}
                height={36}
                borderRadius={9999}
                className="mb-3 sm:mb-4"
              />
              <div className="flex items-center gap-3 sm:gap-4">
                <Skeleton
                  width={48}
                  height={48}
                  borderRadius={16}
                  className="shrink-0"
                />
                <div>
                  <Skeleton
                    width={100}
                    height={12}
                    className="mb-0.5 sm:mb-1"
                  />
                  <Skeleton
                    width={120}
                    height={32}
                    className="mt-0.5 sm:mt-1"
                  />
                </div>
              </div>
              <Skeleton width={130} height={16} className="mt-2 sm:mt-3" />
            </div>
            <Skeleton
              width={180}
              height={70}
              borderRadius={16}
              className="shrink-0 self-start lg:self-auto"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[24px] sm:rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3 sm:gap-4">
              <Skeleton
                width={44}
                height={44}
                borderRadius={16}
                className="shrink-0"
              />
              <div>
                <Skeleton width={100} height={20} className="mb-0.5" />
                <Skeleton width={180} height={14} />
              </div>
            </div>

            <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col items-center justify-center rounded-[20px] sm:rounded-[24px] border-2 border-dashed border-cyan-500/30 dark:border-cyan-500/20 bg-cyan-50/50 dark:bg-slate-800/30 p-6 sm:p-8 md:p-10 min-h-[180px] sm:min-h-[220px] md:min-h-[250px] transition-all">
              <Skeleton
                circle
                width={48}
                height={48}
                className="mb-3 sm:mb-4"
              />
              <Skeleton width={120} height={18} className="mb-1 sm:mb-2" />
              <Skeleton width={180} height={14} />
            </div>

            <div className="mt-4 sm:mt-5 md:mt-6 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 sm:p-5">
              <Skeleton width={100} height={14} className="mb-1 sm:mb-2" />
              <Skeleton width={280} height={12} />
            </div>
          </section>

          <section className="rounded-[24px] sm:rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 shadow-sm transition-all hover:shadow-md">
            <div className="grid gap-4 sm:gap-5 md:gap-6">
              <div>
                <Skeleton width={100} height={12} className="mb-1 sm:mb-2" />
                <Skeleton height={48} borderRadius={16} />
              </div>

              <div>
                <Skeleton width={130} height={12} className="mb-1 sm:mb-2" />
                <Skeleton height={48} borderRadius={16} />
              </div>

              <div>
                <Skeleton width={100} height={12} className="mb-1 sm:mb-2" />
                <Skeleton height={100} borderRadius={16} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Skeleton width={100} height={12} className="mb-1 sm:mb-2" />
                  <Skeleton height={48} borderRadius={16} />
                </div>
                <div>
                  <Skeleton width={120} height={12} className="mb-1 sm:mb-2" />
                  <Skeleton height={48} borderRadius={16} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Skeleton width={80} height={12} className="mb-1 sm:mb-2" />
                  <Skeleton height={48} borderRadius={16} />
                </div>
                <div>
                  <Skeleton width={60} height={12} className="mb-1 sm:mb-2" />
                  <Skeleton height={48} borderRadius={16} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Skeleton width={100} height={12} className="mb-1 sm:mb-2" />
                  <Skeleton height={48} borderRadius={16} />
                </div>
                <div>
                  <Skeleton width={120} height={12} className="mb-1 sm:mb-2" />
                  <Skeleton height={48} borderRadius={16} />
                </div>
              </div>

              <div>
                <Skeleton width={80} height={12} className="mb-1 sm:mb-2" />
                <Skeleton height={48} borderRadius={16} />
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 md:p-6">
                <Skeleton width={70} height={12} className="mb-2 sm:mb-3" />
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Skeleton height={48} className="flex-1" borderRadius={16} />
                  <Skeleton
                    width={48}
                    height={48}
                    borderRadius={16}
                    className="shrink-0"
                  />
                </div>
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                  <Skeleton width={70} height={28} borderRadius={12} />
                  <Skeleton width={90} height={28} borderRadius={12} />
                  <Skeleton width={60} height={28} borderRadius={12} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-1 sm:mt-2">
                <Skeleton width="100%" height={48} borderRadius={16} />
                <Skeleton width="100%" height={48} borderRadius={16} />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-start gap-2 sm:gap-3 border-t border-slate-200 dark:border-slate-700 pt-4 sm:pt-5 md:pt-6 mt-1 sm:mt-2">
                <Skeleton width="100%" height={44} borderRadius={16} />
                <Skeleton width="100%" height={44} borderRadius={16} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </SkeletonTheme>
  );
};

export { AddProductSkeleton };
