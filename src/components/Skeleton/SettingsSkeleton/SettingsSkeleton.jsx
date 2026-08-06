import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CardsSkeleton = ({
  baseColor,
  highlightColor,
  count = 6,
  columns = 3,
}) => {
  const cards = Array(count).fill(null);

  const content = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      {cards.map((_, index) => (
        <div
          key={`card-skeleton-${index}`}
          className="p-4 sm:p-5 md:p-6 bg-white border shadow-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex justify-center mb-3 sm:mb-4">
            <Skeleton
              circle
              width={44}
              height={44}
              className="skeleton-card-icon"
            />
          </div>

          <h4 className="mt-3 sm:mt-4 text-center">
            <Skeleton width={90} height={14} className="mx-auto" />
          </h4>

          <h2 className="mt-1.5 sm:mt-2 text-center">
            <Skeleton width={110} height={26} className="mx-auto" />
          </h2>

          <p className="mt-1.5 sm:mt-2 text-center">
            <Skeleton width={70} height={12} className="mx-auto" />
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

const SettingsSkeleton = ({ baseColor, highlightColor }) => {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <div className="min-h-screen overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 bg-slate-50/50 text-slate-900 dark:bg-slate-900">
        <div className="mx-auto max-w-[1600px] space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
          <div className="relative p-4 sm:p-5 md:p-6 overflow-hidden border shadow-xl rounded-xl border-slate-200 bg-white/90 dark:bg-slate-900 dark:border-slate-700 transition-all hover:shadow-2xl">
            <div className="absolute -right-10 -top-10 h-20 w-20 sm:h-32 sm:w-32 bg-cyan-400/5 blur-2xl"></div>
            <div className="absolute -left-10 -bottom-10 h-20 w-20 sm:h-32 sm:w-32 bg-blue-400/5 blur-2xl"></div>

            <div className="relative z-10">
              <Skeleton width={70} height={12} className="mb-1 sm:mb-2" />
              <Skeleton width={100} height={24} className="mb-1 sm:mb-2" />
              <Skeleton width={120} height={16} />
            </div>
          </div>

          <div className="mt-4 sm:mt-5 md:mt-6">
            <CardsSkeleton
              baseColor={baseColor}
              highlightColor={highlightColor}
              count={6}
              columns={3}
            />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export { SettingsSkeleton, CardsSkeleton };
