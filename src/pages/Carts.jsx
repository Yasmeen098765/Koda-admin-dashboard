import { useState, useEffect } from "react";
import { CartsSkeleton } from "../components/Skeleton/CartsSkeleton/CartsSkeleton";
import useTheme from "../components/customHook/useTheme";
import { useLanguage } from "../Context/LanguageContext";
import { FiShoppingCart, FiBox, FiUsers, FiDollarSign } from "react-icons/fi";

function Carts() {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCarts: 0,
    totalItems: 0,
    totalValue: 0,
    uniqueUsers: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
      setLoading(false);
      setCarts([]);
      setStats({
        totalCarts: 0,
        totalItems: 0,
        totalValue: 0,
        uniqueUsers: 0,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (showSkeleton || loading) {
    const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
    const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

    return (
      <CartsSkeleton
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8 bg-slate-50/50 text-slate-900 dark:bg-slate-900">
      <div className="mx-auto max-w-[1600px] space-y-6 lg:space-y-8 slide-up">
        <div className="relative p-3 sm:p-4 md:p-5 lg:p-6 overflow-hidden transition-all duration-300 border shadow-lg rounded-lg border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:shadow-xl">
          <div className="absolute rounded-full -right-10 sm:-right-14 -top-10 sm:-top-14 h-32 sm:h-44 w-32 sm:w-44 bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5"></div>
          <div className="absolute bottom-0 left-0 rounded-full h-32 sm:h-44 w-32 sm:w-44 bg-blue-400/10 blur-3xl dark:bg-blue-500/5"></div>

          <div className="relative z-10 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
              <div className="flex items-center justify-center text-white shadow-lg h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 shadow-cyan-500/30 shrink-0">
                <FiShoppingCart size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] text-sky-500 dark:text-sky-400 uppercase truncate">
                  {t("carts.title")}
                </p>
                <h2 className="mt-0.5 sm:mt-1 text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate">
                  {t("carts.overview")}
                </h2>
              </div>
            </div>
            <span className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium border rounded-lg border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 backdrop-blur-sm whitespace-nowrap self-start sm:self-auto">
              {t("dashboard.updatedFromApi")}
            </span>
          </div>
          <p className="relative z-10 mt-1.5 sm:mt-2 text-[11px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400">
            {t("carts.description")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 min-[350px]:grid-cols-2 min-[600px]:grid-cols-4">
          <StatCard
            icon={<FiShoppingCart />}
            value={stats.totalCarts}
            label={t("carts.totalCarts")}
            tone="cyan"
          />
          <StatCard
            icon={<FiBox />}
            value={stats.totalItems}
            label={t("carts.totalItems")}
            tone="amber"
          />
          <StatCard
            icon={<FiDollarSign />}
            value={`$${stats.totalValue.toFixed(2)}`}
            label={t("carts.totalValue")}
            tone="emerald"
          />
          <StatCard
            icon={<FiUsers />}
            value={stats.uniqueUsers}
            label={t("carts.uniqueUsers")}
            tone="purple"
          />
        </div>

        {carts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 sm:py-14 md:py-20 lg:py-28 xl:py-32 px-3 sm:px-4 md:px-6 border border-dashed rounded-lg border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30">
            <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mb-2 sm:mb-3 md:mb-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transition-transform hover:scale-110 duration-300">
              <FiShoppingCart size={20} />
            </div>
            <h3 className="mb-1 sm:mb-1.5 md:mb-2 text-base sm:text-lg md:text-xl lg:text-2xl  font-bold text-slate-900 dark:text-white text-center break-words max-w-full">
              {t("carts.noCarts")}
            </h3>
            <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-slate-500 dark:text-slate-400 text-center max-w-xs sm:max-w-sm md:max-w-md break-words">
              {t("carts.noCartsDesc")}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 md:gap-6">
            <div className="p-4 sm:p-5 md:p-6 lg:p-8 border shadow-lg rounded-lg border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30">
              <div className="flex flex-col items-center justify-center py-8 xs:py-12 sm:py-16">
                <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                  <FiShoppingCart size={24} />
                </div>
                <p className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 text-center font-medium">
                  {t("carts.emptyCart")}
                </p>
                <p className="mt-1 sm:mt-2 text-xs md:text-sm text-slate-400 dark:text-slate-500 text-center">
                  {t("carts.emptyCartDesc")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, tone, className = "" }) {
  const tones = {
    cyan: "bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30",
    amber:
      "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30",
    emerald:
      "bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-lg shadow-emerald-500/30",
    purple:
      "bg-gradient-to-br from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/30",
  };

  return (
    <div
      className={`flex flex-col  rounded-md sm:rounded-lg border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}
    >
      <div
        className={`mb-2 sm:mb-3 md:mb-4 lg:mb-5 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 items-center justify-center  rounded-md sm:rounded-lg text-sm sm:text-base md:text-lg lg:text-xl ${tones[tone]}`}
      >
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl  font-black tracking-tight text-slate-900 dark:text-white leading-none truncate max-w-full">
        {value}
      </h3>
      <p className="mt-0.5 sm:mt-1 md:mt-1.5 lg:mt-2 text-[10px] sm:text-[11px] md:text-xs lg:text-sm xl:text-[14px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-full">
        {label}
      </p>
    </div>
  );
}
export default Carts;
