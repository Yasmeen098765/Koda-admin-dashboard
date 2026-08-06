import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const StatsSkeleton = ({ baseColor, highlightColor }) => {
  const stats = Array(4).fill(null);

  const content = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8">
      {stats.map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 sm:p-5 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-slate-900 dark:border-slate-800 transition-all hover:shadow-md"
        >
          <div>
            <Skeleton width={70} height={12} className="mb-1 sm:mb-2" />
            <Skeleton width={50} height={28} />
          </div>
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-xl dark:bg-slate-700">
            <Skeleton circle width={20} height={20} />
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

const TableSkeleton = ({ baseColor, highlightColor }) => {
  const rows = Array(5).fill(null);

  const content = (
    <div className="hidden lg:block overflow-hidden border-0 shadow-sm bg-white dark:bg-slate-900 rounded-xl border-slate-700/50">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-500/20">
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-left text-gray-500">
                <Skeleton width={50} height={14} />
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-left text-gray-500">
                <Skeleton width={40} height={14} />
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-left text-gray-500">
                <Skeleton width={45} height={14} />
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-left text-gray-500">
                <Skeleton width={45} height={14} />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((_, index) => (
              <tr
                key={index}
                className="border-b border-gray-500/10 dark:border-slate-500/20 dark:hover:bg-slate-800/20 transition-colors"
              >
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Skeleton circle width={36} height={36} />
                    <div>
                      <Skeleton width={100} height={14} className="mb-1" />
                      <Skeleton width={130} height={12} />
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <Skeleton width={70} height={22} borderRadius={9999} />
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <Skeleton width={50} height={18} />
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Skeleton width={28} height={28} borderRadius={8} />
                    <Skeleton width={28} height={28} borderRadius={8} />
                    <Skeleton width={28} height={28} borderRadius={8} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

const MobileCardsSkeleton = ({ baseColor, highlightColor }) => {
  const cards = Array(3).fill(null);

  const content = (
    <div className="lg:hidden space-y-3 sm:space-y-4">
      {cards.map((_, index) => (
        <div
          key={index}
          className="p-4 sm:p-5 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-slate-900 dark:border-slate-800 transition-all hover:shadow-md"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <Skeleton circle width={40} height={40} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <div className="min-w-0">
                  <Skeleton
                    width={120}
                    height={16}
                    className="mb-0.5 sm:mb-1"
                  />
                  <Skeleton width={140} height={12} />
                </div>
                <Skeleton width={70} height={22} borderRadius={9999} />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                <div className="px-2 sm:px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800">
                  <Skeleton width={35} height={10} className="mb-0.5 sm:mb-1" />
                  <Skeleton width={50} height={14} />
                </div>
                <div className="px-2 sm:px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800">
                  <Skeleton width={35} height={10} className="mb-0.5 sm:mb-1" />
                  <Skeleton width={60} height={20} borderRadius={9999} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            <Skeleton width={70} height={32} borderRadius={16} />
            <Skeleton width={90} height={32} borderRadius={16} />
            <Skeleton width={70} height={32} borderRadius={16} />
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

const UsersSkeleton = ({ baseColor, highlightColor }) => {
  const content = (
    <div className="min-h-screen overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 sm:bg-gray-50/50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <Skeleton width={120} height={12} className="mb-0.5 sm:mb-1" />
            <Skeleton width={160} height={28} />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Skeleton width="100%" height={44} borderRadius={16} />
            <Skeleton width="100%" height={44} borderRadius={16} />
          </div>
        </div>

        <StatsSkeleton baseColor={baseColor} highlightColor={highlightColor} />

        <TableSkeleton baseColor={baseColor} highlightColor={highlightColor} />

        <MobileCardsSkeleton
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
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

export { UsersSkeleton, StatsSkeleton, TableSkeleton, MobileCardsSkeleton };
