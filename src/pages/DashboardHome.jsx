import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Dashboard.css";
import {
  FaShoppingBag,
  FaClock,
  FaDollarSign,
  FaChartLine,
  FaUsers,
  FaBoxOpen,
} from "react-icons/fa";
import { DashboardSkeleton } from "../components/Skeleton/DashboardSkeleton/DashboardSkeleton";
import useTheme from "../components/customHook/useTheme";
import { useLanguage } from "../Context/LanguageContext";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
};

const actualStatusConfig = {
  pending: {
    label: "PENDING",
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-900/50",
    badgeBg: "bg-amber-100 dark:bg-amber-900/30",
    badgeText: "text-amber-700 dark:text-amber-400",
  },
  processing: {
    label: "PROCESSING",
    color: "text-sky-500 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    border: "border-sky-200 dark:border-sky-900/50",
    badgeBg: "bg-sky-100 dark:bg-sky-900/30",
    badgeText: "text-sky-700 dark:sky-400",
  },
  confirmed: {
    label: "CONFIRMED",
    color: "text-cyan-500 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    border: "border-cyan-200 dark:border-cyan-900/50",
    badgeBg: "bg-cyan-100 dark:bg-cyan-900/30",
    badgeText: "text-cyan-700 dark:text-cyan-400",
  },
  shipped: {
    label: "SHIPPED",
    color: "text-violet-500 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-200 dark:border-violet-900/50",
    badgeBg: "bg-violet-100 dark:bg-violet-900/30",
    badgeText: "text-violet-700 dark:text-violet-400",
  },
  delivered: {
    label: "DELIVERED",
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-900/50",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/30",
    badgeText: "text-emerald-700 dark:text-emerald-400",
  },
  cancelled: {
    label: "CANCELLED",
    color: "text-rose-500 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-200 dark:border-rose-900/50",
    badgeBg: "bg-rose-100 dark:bg-rose-900/30",
    badgeText: "text-rose-700 dark:text-rose-400",
  },
};

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const res = await api.get("/orders/admin");
        if (res.data.success && res.data.orders) {
          const allOrders = res.data.orders;

          const totalOrdersCount = allOrders.length;
          const totalRevenue = allOrders.reduce(
            (sum, o) => sum + (Number(o.totalPrice) || 0),
            0,
          );

          const statusCounts = {
            pending: 0,
            processing: 0,
            confirmed: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
          };
          allOrders.forEach((o) => {
            if (statusCounts[o.status] !== undefined) {
              statusCounts[o.status]++;
            }
          });

          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const lastMonthRevenue = allOrders
            .filter((o) => new Date(o.createdAt) >= thirtyDaysAgo)
            .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

          const productSales = {};
          let totalCustomers = new Set();

          allOrders.forEach((order) => {
            if (order.user?._id) totalCustomers.add(order.user._id);
            else if (order.user) totalCustomers.add(order.user);
            else if (order.shippingAddress?.email)
              totalCustomers.add(order.shippingAddress.email);

            if (order.items && Array.isArray(order.items)) {
              order.items.forEach((item) => {
                const productId = item.product || item.name;
                if (!productId) return;

                if (!productSales[productId]) {
                  productSales[productId] = {
                    name: item.name || "Unknown Product",
                    image:
                      item.image ||
                      "https://placehold.co/100x100/f8fafc/94a3b8?text=No+Image",
                    totalSold: 0,
                  };
                }
                productSales[productId].totalSold += Number(item.quantity) || 1;
              });
            }
          });

          const topProducts = Object.values(productSales)
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 4);

          const sortedOrders = [...allOrders].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          const recentOrders = sortedOrders.slice(0, 5);

          setData({
            orders: { total: totalOrdersCount, ...statusCounts },
            revenue: { total: totalRevenue, lastMonth: lastMonthRevenue },
            recentOrders: recentOrders,
            topProducts: topProducts,
            totalCustomers: totalCustomers.size,
          });
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (err) {
        console.log("Dashboard Error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, []);

  if (loading) {
    const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
    const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

    return (
      <DashboardSkeleton
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />
    );
  }

  if (error) {
    return (
      <div className="p-6 m-4 text-center text-red-500 md:p-8 bg-red-50 dark:bg-red-950/30 rounded-xl md:m-6">
        Error: {error}
      </div>
    );
  }

  if (!data) return null;

  const cards = [
    {
      title: t("dashboard.totalOrders"),
      value: data?.orders?.total || 0,
      icon: <FaShoppingBag />,
      color: "#e546b5",
      caption: t("dashboard.allOrdersReceived"),
    },
    {
      title: t("dashboard.pendingOrders"),
      value: data?.orders?.pending || 0,
      icon: <FaClock />,
      color: "#F59E0B",
      caption: t("dashboard.awaitingAction"),
    },
    {
      title: t("dashboard.revenue"),
      value: formatCurrency(data?.revenue?.total || 0),
      icon: <FaDollarSign />,
      color: "#10B981",
      caption: t("dashboard.totalGrossRevenue"),
    },
    {
      title: t("dashboard.thisMonth"),
      value: formatCurrency(data?.revenue?.lastMonth || 0),
      icon: <FaChartLine />,
      color: "#EC4899",
      caption: t("dashboard.monthlySalesTarget"),
    },
    {
      title: t("dashboard.users"),
      value: data?.totalCustomers || 0,
      icon: <FaUsers />,
      color: "#3B82F6",
      caption: t("dashboard.customersWhoOrdered"),
    },
    {
      title: t("dashboard.topProduct"),
      value: data?.topProducts?.[0]?.totalSold || 0,
      icon: <FaBoxOpen />,
      color: "#8B5CF6",
      caption: data?.topProducts?.[0]?.name
        ? data.topProducts[0].name.length > 20
          ? data.topProducts[0].name.slice(0, 20) + "..."
          : data.topProducts[0].name
        : t("dashboard.mostPopularItem"),
    },
  ];

  return (
    <section className="min-h-screen px-3 py-6 dashboard bg-slate-50 dark:bg-slate-900 sm:p-4 md:p-6 lg:p-8">
      <div className="relative w-full mx-auto space-y-4 slide-up sm:space-y-6">
        {/* ---------- Header banner ---------- */}
        <div className="relative p-5 overflow-hidden transition-all duration-300 border shadow-lg dashboard-header rounded-2xl sm:p-6 md:p-8 bg-gradient-to-br from-slate-100 via-sky-50 to-blue-100/60 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/40 border-slate-200/50 dark:border-slate-700/50 shadow-sky-100/20 dark:shadow-sky-900/20 hover:shadow-xl hover:shadow-sky-200/30 dark:hover:shadow-sky-900/20 hover:border-sky-300/50 hover:from-sky-100 hover:via-sky-200/50 hover:to-blue-200/60 dark:hover:border-slate-700/50 dark:bg-gradient-to-br dark:hover:from-slate-800 dark:hover:via-slate-800/90 dark:hover:to-sky-900/40">
          <div className="absolute w-40 h-40 rounded-full -top-16 -right-16 sm:-top-20 sm:-right-20 sm:w-64 sm:h-64 bg-sky-400/10 blur-3xl dark:bg-sky-500/5" />
          <div className="absolute w-40 h-40 rounded-full -bottom-16 -left-16 sm:-bottom-20 sm:-left-20 sm:w-64 sm:h-64 bg-blue-400/10 blur-3xl dark:bg-blue-500/5" />

          <div className="relative z-10 p-4 sm:p-0">
            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.35em] text-sky-500 dark:text-sky-400 font-semibold">
              {t("dashboard.adminOverview")}
            </p>
            <h2 className="mt-2 text-sm min-[300px]:text-lg font-bold sm:text-2xl md:text-3xl text-slate-900 dark:text-white">
              {t("dashboard.realtimeHealth")}
            </h2>
            <p className="mt-2 text-xs sm:text-base text-slate-600 dark:text-slate-300">
              {t("dashboard.healthDescription")}
            </p>
          </div>
        </div>

        {/* ---------- Metric cards ---------- */}
        <div className="grid w-full grid-cols-1 gap-4 min-[350px]:grid-cols-2 min-[700px]:grid-cols-3 ">
          {cards.map((card, index) => (
            // was never triggering before because this class was missing.
            <div
              className="p-4 transition-all duration-300 border card group sm:p-5 md:p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:from-sky-100 hover:via-sky-200/50 hover:to-blue-200/60 dark:hover:from-slate-800 dark:hover:via-slate-800/90 dark:hover:to-sky-900/30 dark:hover:border-slate-700/50"
              key={index}
            >
              <div
                className="flex items-center justify-center w-10 h-10 mb-3 text-lg text-white transition-all duration-300 rounded-lg card-icon sm:w-12 sm:h-12 sm:text-xl sm:mb-4 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`,
                }}
              >
                {card.icon}
              </div>

              <h4 className="text-xs font-medium tracking-wide uppercase sm:text-sm text-slate-500 dark:text-slate-400">
                {card.title}
              </h4>

              <h2 className="mt-1 font-bold text-md md:text-xl text-slate-900 dark:text-white">
                {card.value}
              </h2>

              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {card.caption}
              </p>
            </div>
          ))}
        </div>

        {/* ---------- Order status + Best sellers ---------- */}
        <div className="bottom-section grid gap-4 md:gap-6 grid-cols-[auto] min-[350px]:grid-cols-[1fr] min-[1200px]:grid-cols-[2fr_1fr] items-start w-full relative">
          <div className="relative w-full p-4 transition-all duration-300 border shadow-xl rounded-xl sm:p-6 border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:shadow-xl hover:-translate-y-1 hover:from-sky-100 hover:via-sky-200/50 hover:to-blue-200/60 dark:hover:from-slate-800 dark:hover:via-slate-800/90 dark:hover:to-sky-900/30 dark:hover:border-slate-700/50">
            <div className="relative flex flex-col w-full gap-3 mb-5 sm:flex-row sm:justify-between sm:items-center sm:mb-6">
              <div>
                <span className="text-sky-500 dark:text-sky-400 tracking-[0.2em] text-[11px] uppercase font-bold">
                  {t("dashboard.orderStatus")}
                </span>
                <h2 className="mt-2 text-sm min-[300px]:text-lg font-semibold sm:text-xl text-slate-900 dark:text-white">
                  {t("dashboard.liveFulfillment")}
                </h2>
              </div>

              <span className="self-start sm:self-auto rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {t("dashboard.updatedFromApi")}
              </span>
            </div>

            <div className="grid gap-3 grid-cols-1 min-[350px]:grid-cols-2 sm:gap-4 min-[500px]:grid-cols-3  w-full relative">
              {[
                "pending",
                "processing",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled",
              ].map((statusKey) => {
                const conf = actualStatusConfig[statusKey];
                const count = data.orders?.[statusKey] || 0;

                return (
                  <div
                    key={statusKey}
                    className={`${conf.bg} ${conf.border} border rounded-lg p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <div
                      className={`${conf.color} tracking-[0.15em] sm:tracking-[0.2em] text-[9px] sm:text-[10px] font-bold uppercase mb-1.5 sm:mb-2`}
                    >
                      {t(`status.${statusKey}`) || conf.label}
                    </div>

                    <div
                      className={`${conf.color} text-2xl sm:text-3xl font-bold`}
                    >
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 min-w-0 transition-all duration-300 border shadow-lg best-seller rounded-xl sm:p-6 border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:shadow-xl hover:-translate-y-1 hover:from-sky-100 hover:via-sky-200/50 hover:to-blue-200/60 dark:hover:from-slate-800 dark:hover:via-slate-800/90 dark:hover:to-sky-900/30 dark:hover:border-slate-700/50">
            <h3 className="mb-3 text-base font-semibold sm:text-lg text-slate-900 dark:text-white sm:mb-4">
              {t("dashboard.bestSeller")}
            </h3>

            <div className="space-y-2.5 sm:space-y-3">
              {data?.topProducts?.map((product, index) => (
                <div
                  className="flex flex-col  min-[290px]:flex-row flex-wrap items-start min-[300px]:items-center gap-3 p-3 transition-all duration-300 border product-item bg-white/70 dark:bg-slate-800/50 rounded-xl border-slate-200/50 dark:border-slate-700/50 sm:p-4 sm:gap-4 hover:shadow-md backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-800/50 dark:hover:border-slate-700/50"
                  key={index}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-10 h-10 rounded-md sm:w-12 sm:h-12 shrink-0 bg-slate-100 dark:bg-slate-700"
                  />

                  <div className="flex-1  min-w-0">
                    <h4 className="text-xs text-wrap min-[300px]:text-sm font-semibold truncate text-slate-900 dark:text-white">
                      {product.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {product.totalSold} {t("dashboard.sold")}
                    </p>
                  </div>

                  <span className="text-sm font-bold text-slate-900 dark:text-white shrink-0">
                    #{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Recent orders ---------- */}
        <div className="p-4 min-w-0 transition-all duration-300 border shadow-lg rounded-xl sm:p-6 border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:shadow-xl hover:-translate-y-1 hover:from-sky-100 hover:via-sky-200/50 hover:to-blue-200/60 dark:hover:from-slate-800 dark:hover:via-slate-800/90 dark:hover:to-sky-900/30 dark:hover:border-slate-700/50">
          <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:flex-wrap sm:justify-between sm:items-center sm:mb-6">
            <div>
              <span className="text-sky-500 dark:text-sky-400 tracking-[0.2em] text-[11px] uppercase font-bold">
                {t("dashboard.recentOrders")}
              </span>
              <h2 className="mt-2 text-md min-[350px]:text-lg font-semibold sm:text-xl text-slate-900 dark:text-white">
                {t("dashboard.latestActivity")}
              </h2>
            </div>
            <span className="self-start px-3 py-1 text-xs font-bold rounded-full sm:self-auto bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
              {data.recentOrders?.length || 0} {t("dashboard.orders")}
            </span>
          </div>

          <div className="space-y-3">
            {data.recentOrders?.map((order) => (
              <div
                key={order._id}
                className="flex flex-col gap-3 px-4 py-4 transition-all duration-300 border sm:flex-row sm:items-center sm:justify-between rounded-lg border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/30 hover:border-slate-300 hover:bg-white/90 dark:hover:border-slate-700/50 dark:hover:bg-slate-800/30 backdrop-blur-sm"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold truncate text-slate-900 dark:text-white">
                    {order.user?.username ||
                      order.shippingAddress?.fullName ||
                      t("dashboard.customer")}
                  </h4>

                  <p className="mt-1 text-xs text-wrap min-[350px]:text-sm truncate text-slate-500 dark:text-slate-400">
                    {order.items?.length > 0 ? (
                      <>
                        {order.items[0].name || "Product"}{" "}
                        {order.items.length > 1 &&
                          `+ ${order.items.length - 1}`}
                      </>
                    ) : (
                      "Order items"
                    )}{" "}
                    • {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      actualStatusConfig[order.status]?.badgeBg ||
                      "bg-slate-200 dark:bg-slate-800"
                    } ${
                      actualStatusConfig[order.status]?.badgeText ||
                      "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {t(`status.${order.status}`) || order.status}
                  </span>

                  <span className="text-xs min-[400px]:text-base font-bold text-slate-900 dark:text-white sm:min-w-[90px] sm:text-right">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
