import { useState, useEffect } from "react";
import { SettingsSkeleton } from "../components/Skeleton/SettingsSkeleton/SettingsSkeleton";
import useTheme from "../components/customHook/useTheme";
import { useLanguage } from "../Context/LanguageContext";
import {
  FiSettings,
  FiMoon,
  FiSun,
  FiGlobe,
  FiBell,
  FiShield,
  FiDatabase,
  FiCloud,
  FiRefreshCw,
  FiCheckCircle,
} from "react-icons/fi";

export default function Settings() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (showSkeleton) {
    const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
    const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

    return (
      <SettingsSkeleton
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 bg-slate-50/50 text-slate-900 dark:bg-slate-900">
      <div className="mx-auto max-w-[1600px] space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-8 slide-up">
        {/* Header Section */}
        <div className="relative p-3 sm:p-4 md:p-5 lg:p-6 overflow-hidden transition-all duration-300 border shadow-lg rounded-xl border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:shadow-xl">
          <div className="absolute rounded-full -right-10 sm:-right-14 -top-10 sm:-top-14 h-32 sm:h-44 w-32 sm:w-44 bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5"></div>
          <div className="absolute bottom-0 left-0 rounded-full h-32 sm:h-44 w-32 sm:w-44 bg-blue-400/10 blur-3xl dark:bg-blue-500/5"></div>

          <div className="relative z-10 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
              <div className="flex items-center justify-center text-white shadow-lg h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 shadow-cyan-500/30 shrink-0">
                <FiSettings size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] text-sky-500 dark:text-sky-400 uppercase truncate">
                  {t("settings.title")}
                </p>
                <h2 className="mt-0.5 sm:mt-1 text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate">
                  {t("settings.heading")}
                </h2>
              </div>
            </div>
            <span className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium border rounded-lg border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 backdrop-blur-sm whitespace-nowrap self-start sm:self-auto">
              v2.0.1
            </span>
          </div>
          <p className="relative z-10 mt-1.5 sm:mt-2 text-[11px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400">
            {t("settings.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          <SettingCard
            icon={<FiMoon />}
            title={t("settings.appearance")}
            description={t("settings.appearanceDesc")}
            tone="cyan"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-3">
              <button
                onClick={toggleTheme}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all flex-1 ${
                  !isDarkMode
                    ? "bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                <FiSun size={14} />
                {t("settings.light")}
              </button>
              <button
                onClick={toggleTheme}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all flex-1 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                <FiMoon size={14} />
                {t("settings.dark")}
              </button>
            </div>
          </SettingCard>

          <SettingCard
            icon={<FiBell />}
            title={t("settings.notifications")}
            description={t("settings.notificationsDesc")}
            tone="amber"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mt-3">
              <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {t("settings.emailNotifications")}
              </span>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-10 sm:w-11 h-5 sm:h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-sky-500"></div>
              </label>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mt-2">
              <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {t("settings.pushNotifications")}
              </span>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-10 sm:w-11 h-5 sm:h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-sky-500"></div>
              </label>
            </div>
          </SettingCard>

          <SettingCard
            icon={<FiShield />}
            title={t("settings.security")}
            description={t("settings.securityDesc")}
            tone="emerald"
          >
            <button className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all border rounded-lg cursor-pointer border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 backdrop-blur-sm">
              {t("settings.changePassword")}
            </button>
            <button className="w-full px-3 sm:px-4 py-2 mt-2 text-xs sm:text-sm font-semibold transition-all border rounded-lg cursor-pointer border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 backdrop-blur-sm">
              {t("settings.twoFactor")}
            </button>
          </SettingCard>

          <SettingCard
            icon={<FiGlobe />}
            title={t("settings.language")}
            description={t("settings.languageDesc")}
            tone="purple"
          >
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border rounded-lg outline-none cursor-pointer border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </SettingCard>

          <SettingCard
            icon={<FiCloud />}
            title={t("settings.apiIntegration")}
            description={t("settings.apiIntegrationDesc")}
            tone="blue"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <FiCheckCircle className="text-emerald-500 shrink-0" size={16} />
              <span>{t("settings.apiStatus")}</span>
            </div>
            <button className="w-full px-3 smx-4 py-2 mt-2 text-xs sm:text-sm font-semibold transition-all border rounded-lg cursor-pointer border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 backdrop-blur-sm">
              <FiRefreshCw className="inline mr-2" size={14} />
              {t("settings.refreshConnection")}
            </button>
          </SettingCard>

          <SettingCard
            icon={<FiDatabase />}
            title={t("settings.database")}
            description={t("settings.databaseDesc")}
            tone="rose"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mt-1">
              <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {t("settings.autoBackup")}
              </span>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-10 sm:w-11 h-5 sm:h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-sky-500"></div>
              </label>
            </div>
            <button className="w-full px-3 sm:px-4 py-2 mt-2 text-xs sm:text-sm font-semibold transition-all border rounded-lg cursor-pointer border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 backdrop-blur-sm">
              {t("settings.exportData")}
            </button>
          </SettingCard>
        </div>
      </div>
    </div>
  );
}

function SettingCard({ icon, title, description, tone, children }) {
  const toneColors = {
    cyan: "from-cyan-500 to-sky-500",
    amber: "from-amber-400 to-orange-500",
    emerald: "from-emerald-400 to-green-500",
    purple: "from-purple-500 to-violet-500",
    blue: "from-blue-500 to-indigo-500",
    rose: "from-rose-400 to-red-500",
  };

  return (
    <div className="p-3 sm:p-4 md:p-5 lg:p-6 transition-all duration-300 border shadow-lg rounded-xl border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start gap-2 sm:gap-3">
        <div
          className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${toneColors[tone]} text-white shadow-lg`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">
            {title}
          </h3>
          <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-3 sm:mt-4">{children}</div>
    </div>
  );
}
