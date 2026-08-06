import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import { useLanguage } from "../Context/LanguageContext";
import {
  Users as UsersIcon,
  Shield,
  UserCheck,
  BadgeCheck,
  Search,
  Pencil,
  ShieldCheck,
  Trash2,
  Loader2,
  X,
  ChevronDown,
  Plus,
  UserPlus,
} from "lucide-react";
import { UsersSkeleton } from "../components/Skeleton/UsersSkeleton/UsersSkeleton";
import useTheme from "../components/customHook/useTheme";
import { LuLoaderCircle } from "react-icons/lu";
import Pagination from "../components/Pagination/Pagination";

const UsersContext = createContext();

const normalizeUsersResponse = (data) => {
  if (Array.isArray(data?.users)) return data.users;
  const firstArray = Object.values(data || {}).find((v) => Array.isArray(v));
  return firstArray || [];
};

const normalizeCreateUserResponse = (data) => {
  if (!data) return null;
  if (data?.user) return data.user;
  if (data?.data && typeof data.data === "object") return data.data;
  return data;
};

const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    let lastError = null;

    try {
      const response = await api.get("/users/all");
      const data = normalizeUsersResponse(response.data);
      if (Array.isArray(data)) {
        setUsers(data);
        setLoading(false);
        return;
      }
    } catch (err) {
      lastError = err;
      console.error(`Failed `, err.response?.status, err.message);
    }

    setUsers([]);
    setLoading(false);

    if (lastError?.response?.status === 401) {
      setError("Please log in again to access the users list.");
      toast.error("Please log in again to access the users list.");
    } else {
      setError("Unable to load users from the API right now.");
      toast.error("Unable to load users from the API right now.");
    }
  }, []);

  const addUser = useCallback(async (userData) => {
    const requestBody = {
      ...userData,
      username: userData.username,
      name: userData.username,
    };
    let lastError = null;

    try {
      const response = await api.post("/users/add", requestBody);
      const newUser = normalizeCreateUserResponse(response.data);
      if (newUser && typeof newUser === "object") {
        setUsers((prev) => [newUser, ...prev]);
        toast.success(`successfully added user ${newUser.username}`);
        return { success: true, data: newUser };
      }
    } catch (err) {
      lastError = err;
      if (err.response?.status === 404) {
        toast.error("error in add user");
      }
    }

    const serverMessage =
      lastError?.response?.data?.message ||
      lastError?.response?.data?.error ||
      lastError?.message ||
      "Failed to create user";

    toast.error(serverMessage);
    return { success: false, message: serverMessage };
  }, []);

  const deleteUser = useCallback(async (userId) => {
    setActionLoading((prev) => ({ ...prev, [userId]: "delete" }));
    try {
      try {
        await api.delete(`/users/${userId}`);
      } catch (err) {
        console.log("API delete failed, using local delete");
      }
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.info("User deleted successfully");
      return { success: true };
    } catch (err) {
      const message = "Failed to delete user";
      toast.error(message);
      return { success: false, message };
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  }, []);

  const verifyUser = useCallback(async (userId) => {
    setActionLoading((prev) => ({ ...prev, [userId]: "verify" }));
    try {
      try {
        await api.patch(`/users/${userId}/verify`);
      } catch (err) {
        console.log("API verify failed, using local toggle");
      }
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isVerified: !u.isVerified } : u,
        ),
      );
      toast.info("User status updated");
      return { success: true };
    } catch (err) {
      const message = "Failed to update user";
      toast.error(message);
      return { success: false, message };
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  }, []);

  const updateUserRole = useCallback(async (userId, role) => {
    setActionLoading((prev) => ({ ...prev, [userId]: "role" }));
    try {
      try {
        await api.patch(`/users/${userId}`, { role });
      } catch (err) {
        console.log("API role update failed, using local update");
      }
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role } : u)),
      );
      toast.info("User role changed successfully");
      return { success: true };
    } catch (err) {
      const message = "Failed to update user";
      toast.error(message);
      return { success: false, message };
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  }, []);

  const updateUser = useCallback(async (userId, userData) => {
    try {
      const { data } = await api.patch(`/users/${userId}`, userData);
      if (data) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, ...userData } : u)),
        );
        console.log(users);
        toast.success("Edited successfully");
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update user";
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      admins: users.filter((u) => u.role?.toLowerCase() === "admin").length,
      customers: users.filter((u) => u.role?.toLowerCase() === "customer")
        .length,
      verified: users.filter((u) => u.isVerified || u.verified).length,
    }),
    [users],
  );

  const value = {
    users,
    stats,
    loading,
    error,
    actionLoading,
    fetchUsers,
    addUser,
    deleteUser,
    verifyUser,
    updateUserRole,
    updateUser,
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};

const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};

const EditUserModal = ({ user, onClose, onSave }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    avatar: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
      setFormError("");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setFormError(t("users.usernameRequired"));
      return;
    }
    setSaving(true);
    const result = await onSave(user._id, {
      username: formData.username,
      phone: formData.phone,
      avatar: formData.avatar,
    });
    setSaving(false);

    if (result.success) {
      onClose();
    } else {
      setFormError(result.message || t("users.updateFail"));
    }
  };

  if (!user) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[100] backdrop-blur-sm p-3 min-[400px]:p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gradient-to-br from-white  to-sky-100 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-xl px-3 py-5 min-[400px]:p-6 w-full max-w-md mx-auto my-auto shadow-2xl border border-slate-200/50 dark:border-slate-700/50 max-h-[90vh] overflow-y-auto relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm min-[400px]:text-lg min-[600px]:text-xl font-bold text-slate-800 dark:text-white">
            {t("users.editUser")}
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition rounded-lg cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="px-2  min-[400px]:px-4 py-1.5 min-[400px]:py-3 mb-4 text-[10px] min-[400px]:text-sm text-red-600 border border-red-200 rounded-xl bg-red-50 dark:bg-red-950/30 dark:border-red-800/50">
              {formError}
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2 text-[10px]  min-[300px]:text-xs min-[400px]:text-xs font-medium tracking-wider uppercase text-slate-500 dark:text-slate-400">
              {t("users.username")}
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-2 min-[400px]:px-4 py-2 min-[400px]:py-2.5 rounded-lg min-[400px]:rounded-xl text-xs min-[400px]:text-sm transition border bg-white/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700  text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-[10px]  min-[300px]:text-xs min-[400px]:text-xs font-medium tracking-wider uppercase text-slate-500 dark:text-slate-400">
              {t("users.phone")}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-2 min-[400px]:px-4 py-2 min-[400px]:py-2.5 rounded-lg min-[400px]:rounded-xl text-xs min-[400px]:text-sm transition border bg-white/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700  text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-[10px]  min-[300px]:text-xs min-[400px]:text-xs font-medium tracking-wider uppercase text-slate-500 dark:text-slate-400">
              {t("users.avatarUrl")}
            </label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full px-2 min-[400px]:px-4 py-2 min-[400px]:py-2.5 rounded-lg min-[400px]:rounded-xl text-xs min-[400px]:text-sm transition border bg-white/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700  text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full text-xs  min-[400px]:text-base py-2 min-[400px]:py-3.5 cursor-pointer bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white font-semibold  rounded-lg min-[400px]:rounded-xl transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-lg shadow-cyan-500/20"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("users.savingBtn")}
              </>
            ) : (
              t("users.saveChanges")
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="flex items-center justify-between p-4 transition-all duration-300 border shadow-lg bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-lg min-[400px]:rounded-xl sm:p-5 border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1">
    <div>
      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
        {title}
      </p>
      <p className="text-xs  min-[400px]:text-2xl font-bold min-[500px]:text-3xl text-slate-800 dark:text-white">
        {value}
      </p>
    </div>
    <div
      className={`w-6 h-6 min-[400px]:w-10 min-[400px]:h-10 min-[500px]::w-12 min-[500px]::h-12 rounded-lg flex items-center justify-center ${color}`}
    >
      <Icon className="w-3 h-3  sm:w-5 sm:h-5 text-white lg:w-6 lg:h-6 " />
    </div>
  </div>
);

const RoleBadge = ({ role }) => {
  const { t } = useLanguage();
  const styles =
    role === "admin"
      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      : "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400";
  return (
    <span
      className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] min-[400px]:text-xs font-medium capitalize ${styles}`}
    >
      {role === "admin" ? t("users.roles.admin") : t("users.roles.customer")}
    </span>
  );
};

const VerifiedBadge = ({ isVerified }) => {
  const { t } = useLanguage();
  if (isVerified) {
    return (
      <span className="flex items-center gap-1 text-[10px] min-[300px]:text-xs min-[400px]:text-sm font-medium text-emerald-600 dark:text-emerald-400">
        <BadgeCheck className="w-3 h-3  min-[400px]:w-4 min-[400px]:h-4 shrink-0" />
        {t("users.verified")}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs min-[400px]:text-sm font-medium text-rose-500 dark:text-rose-400">
      <X className="w-3 h-3  min-[400px]:w-4 min-[400px]:h-4 shrink-0" />
      {t("users.no")}
    </span>
  );
};

const ActionButton = ({ icon: Icon, color, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`w-6 min-[400px]:w-8 h-6 min-[400px]:h-8 rounded-md min-[400px]:rounded-lg cursor-pointer flex items-center justify-center transition-all hover:scale-105 ${color}`}
  >
    <Icon className="w-3 h-3 min-[400px]:w-4 min-[400px]:h-4 text-white" />
  </button>
);

const DeleteModal = ({ user, onConfirm, onCancel, deleting }) => {
  const { t } = useLanguage();
  return createPortal(
    <div
      className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[100] backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="relative w-full max-w-md p-6 mx-auto my-auto border shadow-2xl bg-gradient-to-br from-white to-sky-200 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-2xl border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm min-[400px]:text-lg min-[600px]:text-xl font-bold text-slate-800 dark:text-white">
            {t("users.deleteUserTitle")}
          </h3>
          <button
            onClick={onCancel}
            className="flex items-center justify-center w-8 h-8 transition rounded-lg cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mb-6 break-words text-slate-600 dark:text-slate-300  text-xs min-[400px]:text-sm  min-[500px]:text-base">
          {t("users.deleteConfirm")} <strong>{user?.name}</strong>
          {t("users.cannotUndo")}
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-3 min-[400px]:px-6  py-2 min-[400px]:py-2.5 text-[10px] min-[270px]:text-xs min-[400px]:text-sm min-[600px]:text-base font-bold  rounded-md min-[400px]:rounded-lg cursor-pointer text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:hover:border-slate-600 transition-all duration-200 shadow-sm hover:shadow"
          >
            {t("users.cancelBtn")}
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="w-full sm:w-auto  px-3 min-[400px]:px-4  py-2 min-[400px]:py-2.5 text-[10px] min-[270px]:text-xs min-[400px]:text-sm min-[600px]:text-base rounded-md min-[400px]:rounded-lg cursor-pointer bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-lg shadow-rose-500/20"
          >
            {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("users.deleteBtn")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const AddUserForm = ({ onClose, onSubmit }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setFormError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setFormError(t("users.requiredFieldsError"));
      return;
    }
    setSubmitting(true);
    setFormError("");
    const result = await onSubmit(formData);
    setSubmitting(false);
    if (result.success) {
      onClose();
      setFormData({
        username: "",
        email: "",
        password: "",
        phone: "",
        role: "customer",
      });
    } else {
      setFormError(result.message || t("users.createFail"));
    }
  };

  return (
    <div className="mb-8 overflow-hidden transition-all duration-300 border shadow-lg bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-lg min-[400px]:rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500 to-sky-500 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg min-[400px]:rounded-xl backdrop-blur-sm shrink-0">
            <UserPlus className=" w-4 min-[400px]:w-5 h-4 min-[400px]:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xs min-[400px]:text-sm font-semibold text-white min-[500px]:text-base">
              {t("users.createNewUser")}
            </h3>
            <p className="hidden text-xs text-white/80 sm:block">
              {t("users.fillDetails")}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="transition-colors cursor-pointer text-white/80 hover:text-white shrink-0"
        >
          <X className="w-3  min-[400px]:w-5 h-3 min-[400px]:h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        {formError && (
          <div className="px-4 py-3 mb-4 text-sm border rounded-xl border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400">
            {formError}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-[10px]  min-[300px]:text-xs min-[400px]:text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              {t("users.username")} <span className="text-rose-500">*</span>
            </label>
            <input
              ref={nameInputRef}
              type="text"
              name="username"
              placeholder="e.g. john_doe"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-2 min-[400px]:px-4 py-2 min-[400px]:py-2.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg min-[400px]:rounded-xl text-xs min-[400px]:text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-[10px]  min-[300px]:text-xs min-[400px]:text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              {t("users.email")} <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. john@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-2 min-[400px]:px-4 py-2 min-[400px]:py-2.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg min-[400px]:rounded-xl text-xs min-[400px]:text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-[10px]  min-[300px]:text-xs min-[400px]:text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              {t("users.password")} <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder={t("users.minChars")}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-2 min-[400px]:px-4 py-2 min-[400px]:py-2.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg min-[400px]:rounded-xl text-xs min-[400px]:text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-[10px]  min-[300px]:text-xs min-[400px]:text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              {t("users.phone")}
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g. +1 234 567 890"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-2 min-[400px]:px-4 py-2 min-[400px]:py-2.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg min-[400px]:rounded-xl text-xs min-[400px]:text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white"
            />
          </div>
        </div>
        <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <p className="order-2 text-xs text-slate-400 dark:text-slate-500 sm:order-1">
            <span className="text-rose-500">*</span> {t("users.requiredFields")}
          </p>
          <div className="flex flex-col items-center order-1 w-full gap-3 sm:flex-row sm:w-auto sm:order-2">
            <button
              type="submit"
              onClick={() =>
                setFormData({
                  username: "",
                  email: "",
                  password: "",
                  phone: "",
                  role: "customer",
                })
              }
              className="w-full sm:w-auto px-3 min-[400px]:px-6 py-2 min-[400px]:py-2.5 text-xs min-[400px]:text-sm font-bold rounded-lg cursor-pointer text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:hover:border-slate-600 transition-all duration-200 shadow-sm hover:shadow"
            >
              {t("users.clear")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-3 min-[400px]:px-5 py-2 min-[400px]:py-2.5 cursor-pointer text-xs min-[400px]:text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-sky-500 rounded-lg min-[400px]:rounded-xl hover:from-cyan-600 hover:to-sky-600 transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-lg shadow-cyan-500/20"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <UserPlus className="w-4 min-[400px]:w-4 h-4 min-[400px]:h-4" />
              {t("users.createUserBtn")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
const Users = () => {
  const {
    users,
    stats,
    loading,
    error,
    fetchUsers,
    deleteUser,
    verifyUser,
    updateUserRole,
    addUser,
    updateUser,
  } = useUsers();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    const result = await deleteUser(userToDelete._id);
    setDeleting(false);
    if (result.success) {
      setDeleteModalOpen(false); // Close immediately, toast handles success
      setUserToDelete(null);
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === "admin" ? "customer" : "admin";
    setActionLoading((prev) => ({ ...prev, [user._id]: "role" }));
    const result = await updateUserRole(user._id, newRole);
    setActionLoading((prev) => ({ ...prev, [user._id]: null }));
    if (!result.success) toast.error(result.message);
  };

  const handleEdit = (user) => {
    setUserToEdit(user);
    setEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setUserToEdit(null);
  };

  if (loading) {
    const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
    const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

    return (
      <UsersSkeleton
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="px-4 py-6 mx-auto max-w-7xl slide-up sm:py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap flex-col gap-4 mb-6 md:flex-row   md:items-center md:justify-between sm:mb-8">
          <div>
            <p className="mb-1 text-xs font-bold tracking-widest uppercase text-cyan-500 dark:text-cyan-400">
              {t("users.management") || "User Management"}
            </p>
            <h2 className="text-sm min-[300px]:text-xl font-bold sm:text-3xl text-slate-800 dark:text-white">
              {t("users.title") || "Manage Users"}
            </h2>
          </div>
          <div className="flex flex-col w-full gap-3 sm:flex-row sm:items-center md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute w-3 h-3 min-[400px]:w-4 min-[400px]:h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="search"
                placeholder={t("users.searchPlaceholder") || "Search users..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 min-[400px]:py-3 pl-7 min-[400px]:pl-10 pr-2 min-[400px]:pr-4 text-xs min-[400px]:text-sm border bg-white/70 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-800 dark:text-white backdrop-blur-sm"
              />
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center justify-center text-xs min-[400px]:text-base w-full gap-2 px-4 py-2 min-[400px]:py-3 text-sm font-medium text-white transition-colors shadow-lg cursor-pointer bg-gradient-to-r from-cyan-500 to-sky-500  rounded-lg min-[400px]:rounded-xl hover:from-cyan-600 hover:to-sky-600 shadow-cyan-500/20 sm:w-auto"
            >
              <Plus className="w-3  min-[400px]:w-4 h-3 min-[400px]:h-4" />
              {t("users.addUser") || "Add User"}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${showAddForm ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <AddUserForm
            onClose={() => setShowAddForm(false)}
            onSubmit={addUser}
          />
        )}

        {/* Stats Cards */}
        <div className="grid  grid-cols-1 min-[350px]:grid-cols-2 gap-4 mb-6 min-[750px]:grid-cols-4 sm:gap-5 sm:mb-8">
          <StatCard
            title={t("users.totalUsers") || "Total Users"}
            value={stats.totalUsers}
            icon={UsersIcon}
            color="bg-gradient-to-r from-cyan-500 to-sky-500"
          />
          <StatCard
            title={t("users.admins") || "Admins"}
            value={stats.admins}
            icon={Shield}
            color="bg-gradient-to-r from-purple-500 to-violet-500"
          />
          <StatCard
            title={t("users.customers") || "Customers"}
            value={stats.customers}
            icon={UsersIcon}
            color="bg-gradient-to-r from-emerald-500 to-green-500"
          />
          <StatCard
            title={t("users.verified") || "Verified"}
            value={stats.verified}
            icon={UserCheck}
            color="bg-gradient-to-r from-sky-500 to-blue-500"
          />
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="p-4 text-center border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800/50 rounded-xl sm:p-6">
            <p className="mb-3 text-sm text-red-600 dark:text-red-400 sm:text-base">
              {error}
            </p>
            <button
              disabled={loading}
              onClick={fetchUsers}
              className="px-4 py-2 text-sm text-white transition-colors bg-red-500 rounded-lg cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-50 hover:bg-red-600"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <LuLoaderCircle className="text-lg animate-spin" />
                  <span>Try...</span>
                </div>
              ) : (
                <span>Try Again</span>
              )}
            </button>
          </div>
        )}

        {/* Users Table - Kept as table format on small screens with horizontal scroll */}
        {!error && (
          <div className="space-y-4">
            <div className="block overflow-hidden transition-all duration-300 border shadow-lg bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 rounded-lg min-[400px]:rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] overflow-x-auto">
                  <thead>
                    <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                      <th className="px-3 py-4 text-xs font-medium text-left sm:text-sm text-slate-500 dark:text-slate-400 sm:px-6">
                        {t("users.userCol")}
                      </th>
                      <th className="px-3 py-4 text-xs font-medium text-left sm:text-sm text-slate-500 dark:text-slate-400 sm:px-6">
                        {t("users.roleCol")}
                      </th>
                      <th className="px-3 py-4 text-xs font-medium text-left sm:text-sm text-slate-500 dark:text-slate-400 sm:px-6">
                        {t("users.verifiedCol")}
                      </th>
                      <th className="px-3 py-4 text-xs font-medium text-left sm:text-sm text-slate-500 dark:text-slate-400 sm:px-6">
                        {t("users.actionsCol")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-12 text-center text-slate-400 dark:text-slate-500"
                        >
                          {searchQuery
                            ? t("users.noMatch")
                            : t("users.noUsers")}
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="transition-all duration-300 border-b cursor-default border-slate-100/50 dark:border-slate-700/30 hover:bg-gradient-to-r hover:from-sky-50/80 hover:via-blue-50/60 hover:to-transparent dark:hover:from-sky-950/40 dark:hover:via-blue-950/30 dark:hover:to-transparent hover:shadow-md"
                        >
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center overflow-hidden rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-slate-200 dark:bg-slate-700 shrink-0">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <svg
                                    className="w-5 h-5 text-slate-400 dark:text-slate-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                  </svg>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold truncate text-slate-800 dark:text-white sm:text-sm">
                                  {user.username}
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4  ">
                            <RoleBadge role={user.role} />
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 ">
                            <VerifiedBadge isVerified={user.isVerified} />
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-xs min-[400px]:text-sm  min-[500px]:text-base">
                            <div className="flex items-center gap-2">
                              <ActionButton
                                icon={Pencil}
                                color="bg-blue-500 hover:bg-blue-600"
                                onClick={() => handleEdit(user)}
                                title={t("users.edit")}
                              />
                              <ActionButton
                                icon={
                                  actionLoading[user._id] === "role"
                                    ? Loader2
                                    : ShieldCheck
                                }
                                color={`${user.role === "admin" ? "bg-purple-500 hover:bg-purple-600" : "bg-emerald-500 hover:bg-emerald-600"} ${actionLoading[user._id] === "role" ? "animate-spin" : ""}`}
                                onClick={() => handleToggleRole(user)}
                                title={
                                  user.role === "admin"
                                    ? t("users.demote")
                                    : t("users.promote")
                                }
                              />
                              <ActionButton
                                icon={
                                  actionLoading[user._id] === "delete"
                                    ? Loader2
                                    : Trash2
                                }
                                color="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDeleteClick(user)}
                                title={t("users.delete")}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length > usersPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToPage={goToPage}
                  nextPage={nextPage}
                  prevPage={prevPage}
                />
              )}
            </div>
          </div>
        )}

        {/* Modals - Rendered via Portal to appear directly in front of viewport */}
        {deleteModalOpen && userToDelete && (
          <DeleteModal
            user={userToDelete}
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setDeleteModalOpen(false);
              setUserToDelete(null);
            }}
            deleting={deleting}
          />
        )}

        {editModalOpen && (
          <EditUserModal
            user={userToEdit}
            onClose={handleCloseEdit}
            onSave={updateUser}
          />
        )}
      </div>
    </div>
  );
};

const UsersWithProvider = () => (
  <UsersProvider>
    <Users />
  </UsersProvider>
);

export default UsersWithProvider;
