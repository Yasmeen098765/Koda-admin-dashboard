import { useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, Menu, Globe } from "lucide-react";
import kodaLogo from "../assets/images/KodaLogo2.png";
import useTheme from "../components/customHook/useTheme";
import { useLanguage } from "../Context/LanguageContext";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="h-[72px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 transition-colors">
      <div className="flex items-center gap-2 min-[400px]:gap-3">
        <button
          onClick={onMenuClick}
          className="cursor-pointer lg:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          <Menu size={22} />
        </button>

        <img
          src={kodaLogo}
          alt="Koda Store"
          className="w-[45px]    min-[350px]:w-[50px] h-7 min-[400px]:w-auto min-[400px]:h-9"
        />
        <div className="hidden min-[530px]:block">
          <h1 className="text-lg font-bold leading-none text-slate-900 dark:text-white">
            {t("navbar.title")}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("navbar.subtitle")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 min-[400px]:gap-3">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center text-[10px] min-[350px]:text-xs min-[400px]:text-base w-8 min-[400px]:w-10 h-8 min-[400px]:h-10 transition-colors border rounded-full cursor-pointer border-slate-200 dark:border-slate-600 text-slate-500 dark:text-yellow-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        <button
          onClick={toggleLang}
          className="h-8 min-[400px]:h-10 cursor-pointer rounded-full border border-slate-200 dark:border-slate-600 px-2 min-[400px]:px-3 flex items-center gap-1.5 text-[10px] min-[350px]:text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title={lang === "en" ? "تغيير إلى العربية" : "Switch to English"}
          aria-label="Toggle language"
        >
          <Globe size={16} className="text-cyan-500" />
          <span className="hidden min-[280px]:block">{lang === "en" ? "عربي" : "EN"}</span>
        </button>

        <div className="items-center hidden gap-2 pl-1 md:flex">
          <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white rounded-full bg-sky-500">
            AA
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {t("navbar.adminAccount")}
            </p>
            <p className="text-xs text-slate-400">{t("navbar.admin")}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center cursor-pointer gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-2.5 min-[400px]:px-4 py-2  min-[400px]:py-2.5 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">{t("navbar.logout")}</span>
        </button>
      </div>
    </header>
  );
}
