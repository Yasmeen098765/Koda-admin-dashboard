import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./SettingsSkeleton.css";

const CardsSkeleton = ({
  baseColor,
  highlightColor,
  count = 6,
  columns = 3,
}) => {
  const cards = Array(count).fill(null);

  const content = (
    <div
      className={`cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-4`}
    >
      {cards.map((_, index) => (
        <div
          key={`card-skeleton-${index}`}
          className="p-6 bg-white border shadow-sm card-skeleton dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl"
        >
          <div className="flex justify-center mb-4 card-icon skeleton-card-icon-wrapper">
            <Skeleton
              circle
              width={48}
              height={48}
              className="skeleton-card-icon"
            />
          </div>

          <h4 className="mt-4 text-center">
            <Skeleton width={100} height={14} className="mx-auto" />
          </h4>

          <h2 className="mt-2 text-center">
            <Skeleton width={120} height={28} className="mx-auto" />
          </h2>

          <p className="mt-2 text-center dash-card-caption">
            <Skeleton width={80} height={12} className="mx-auto" />
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
      <div className="min-h-screen p-4 skeleton-settings-container setting-container lg:p-8 bg-slate-100 text-slate-900 dark:bg-slate-900">
        <div className="space-y-6 setting-main dark:bg-slate-900">
          {/* Header Section */}
          <div className="p-6 border shadow-xl skeleton-setting-header setting-header rounded-3xl border-slate-200 bg-white/90 dark:bg-slate-900">
            <Skeleton
              width={80}
              height={14}
              className="mb-2 skeleton-loading"
            />
            <Skeleton
              width={250}
              height={28}
              className="mb-2 skeleton-loading skeleton-header-title"
            />
            <Skeleton
              width={400}
              height={16}
              className="skeleton-loading skeleton-header-subtitle"
            />
          </div>

          {/* Cards Section */}
          <div className="mt-6">
            <CardsSkeleton
              baseColor={baseColor}
              highlightColor={highlightColor}
              count={6}
            />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export { SettingsSkeleton, CardsSkeleton };
