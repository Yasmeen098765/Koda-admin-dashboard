import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiImage,
  FiPlus,
  FiStar,
  FiX,
  FiLoader,
} from "react-icons/fi";
import api from "../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AddProductSkeleton } from "../components/Skeleton/AddProductSkeleton/AddProductSkeleton";
import useTheme from "../components/customHook/useTheme";
import { useLanguage } from "../Context/LanguageContext";

export default function AddProduct() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    sku: "",
    category: "",
    subcategory: "",
    brand: "",
    featured: false,
    isActive: true,
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const availableSlots = 5 - images.length;
    const allowedFiles = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      toast.error(
        `You can only upload up to 5 images. Only ${allowedFiles.length} were added.`,
      );
    }

    if (allowedFiles.length === 0) return;

    const newPreviews = allowedFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...allowedFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddTag = () => {
  const trimmed = tagInput.trim();
  if (trimmed && !tags.includes(trimmed)) {
    const newTags = [...tags, trimmed];
    console.log("📝 Added tag:", trimmed);
    console.log("📝 New tags array:", newTags);
    setTags(newTags);
    setTagInput("");
  }
};

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (images.length === 0) {
    toast.error("Please upload at least one image.");
    return;
  }

  setLoading(true);
  try {
    const data = new FormData();

    // ✅ إضافة الحقول النصية (مثل Edit.jsx)
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "" && formData[key] !== null && formData[key] !== undefined) {
        if (typeof formData[key] === "boolean") {
          data.append(key, String(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      }
    });

    // ✅ إضافة tags (مثل Edit.jsx)
    if (tags.length > 0) {
      tags.forEach((tag) => data.append("tags", tag));
    }

    // ✅ إضافة الصور (مثل Edit.jsx)
    images.forEach((image) => {
      data.append("images", image);
    });

    // ✅ سجل البيانات في Console
    console.log("📦 FormData entries:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    // ✅ إرسال الطلب
    const response = await api.post("/products", data);

    console.log("✅ Response:", response.data);

    toast.success("Product created successfully!");
    setTimeout(() => {
      navigate("/products");
    }, 1500);
  } catch (error) {
    console.error("❌ Create Product Error:", error);
    console.error("❌ Error response:", error.response?.data);
    
    // ✅ عرض رسائل الخطأ بشكل أفضل
    if (error.response?.data?.errors) {
      const errs = error.response.data.errors;
      if (Array.isArray(errs) && errs.length > 0) {
        toast.error(errs.join(", "));
      } else if (typeof errs === "string") {
        toast.error(errs);
      } else {
        toast.error(JSON.stringify(errs));
      }
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Failed to create product. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  if (showSkeleton) {
    const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
    const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

    return (
      <AddProductSkeleton
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />
    );
  }

  return (
    <main className=" px-3 py-6 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 min-h-screen bg-slate-50 text-slate-900 mx-auto max-w-[1600px] dark:bg-slate-900">
      <div className="slide-up">
        <div className="relative p-4 mb-6 overflow-hidden transition-all duration-300 border shadow-lg sm:p-6 md:p-8 sm:mb-8 rounded-xl border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:shadow-xl">
          <div className="absolute rounded-full -right-14 -top-14 h-44 w-44 bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5"></div>
          <div className="absolute bottom-0 left-0 rounded-full h-44 w-44 bg-blue-400/10 blur-3xl dark:bg-blue-500/5"></div>

          <div className="relative z-10 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-3 py-2 text-xs transition-all border rounded-lg sm:px-4 sm:text-sm border-slate-200 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 backdrop-blur-sm"
              >
                <FiArrowLeft size={14} />
                <span className="hidden xs:inline">
                  {t("addProduct.backToProducts")}
                </span>
                <span className="xs:hidden">
                  {t("addProduct.backToProducts")}
                </span>
              </Link>

              <div className="flex items-start gap-2 min-[400px]:gap-5  mt-3">
                <div className="flex items-center justify-center text-white rounded-lg shadow-lg w-10  min-[400px]:w-12 min-[640px]:w-15 h-10 min-[400px]:h-12 min-[640px]:h-15 shrink-0  bg-gradient-to-br from-cyan-500 to-sky-500 shadow-cyan-500/30">
                  <FiPackage className="text-white w-6 h-6 min-[400px]:w-7 min-[400px]:h-7" />
                </div>
                <div className="flex flex-col justify-center mb-3 ">
                  <span className="text-[8px]  min-[270px]:text-[10px] min-[400px]:text-sm font-bold tracking-[0.25em] text-sky-500 dark:text-sky-400 uppercase mb-1">
                    {t("addProduct.createProduct")}
                  </span>
                  <h1 className="text-sm  min-[400px]:text-xl  min-[500px]:text-2xl  min-[640px]:text-[29px] leading-none font-black text-slate-900 dark:text-white tracking-tight">
                    {t("addProduct.launchTitle")}
                  </h1>
                </div>
              </div>
              <p className="mt-3 sm:mt-4 text-sm min-[400px]:text-[15px] text-slate-500 dark:text-slate-400 font-medium">
                {t("addProduct.launchDesc")}
              </p>
            </div>

            <div className="w-full p-4 border rounded-lg shadow-lg lg:w-auto sm:p-5 border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-sky-500 dark:text-sky-400">
                {t("addProduct.ready")}
              </p>
              <p className="mt-1 text-sm sm:text-[14px] font-medium text-slate-600 dark:text-slate-300">
                {t("addProduct.readyDesc")}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-[1fr] min-[850px]:grid-cols-[0.95fr_1.05fr] min-[1024px]:grid-cols-[1fr]  min-[1200px]:grid-cols-[0.95fr_1.05fr]"
        >
          <section className="  px-4 py-5 min-[400px]:p-6 transition-all duration-300 border shadow-lg sm:p-6 rounded-xl border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:shadow-xl">
            <div className="flex items-start gap-3 min-[400px]:gap-4">
              <div className="flex items-center justify-center rounded-lg shadow-lg w-10  min-[400px]:w-12 min-[640px]:w-15 h-10 min-[400px]:h-12 min-[640px]:h-15  shrink-0 bg-gradient-to-br from-cyan-500 to-sky-500 shadow-cyan-500/20">
                <FiImage className="text-white w-6 h-6 min-[400px]:w-7 min-[400px]:h-7" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight sm:text-xl text-slate-900 dark:text-white">
                  {t("addProduct.gallery")}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {t("addProduct.galleryDesc")}
                </p>
              </div>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-1 gap-3 mt-6 sm:gap-4 sm:mt-8 min-[300px]:grid-cols-2">
                {imagePreviews.map((preview, idx) => (
                  <article
                    key={idx}
                    className="relative overflow-hidden transition-all duration-300 border rounded-lg shadow-sm group border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 hover:shadow-md"
                  >
                    <div className="flex items-center justify-center h-40 sm:h-48">
                      <img
                        src={preview}
                        alt={`preview-${idx}`}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 sm:px-3 py-1 rounded-lg text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300 shadow-sm">
                      {t("addProduct.image")} {idx + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute flex items-center justify-center text-white transition-opacity rounded-lg shadow-lg opacity-0 cursor-pointer w-7 h-7 sm:w-8 sm:h-8 top-2 sm:top-3 right-2 sm:right-3 bg-gradient-to-r from-rose-500 to-red-500 group-hover:opacity-100 shadow-rose-500/30 hover:from-rose-600 hover:to-red-600"
                    >
                      <FiX size={14} />
                    </button>
                  </article>
                ))}
              </div>
            )}

            {images.length < 5 && (
              <label className="flex flex-col items-center justify-center p-6 mt-4 text-center transition-all border-2 border-dashed rounded-lg cursor-pointer sm:p-10 sm:mt-6 border-cyan-500/30 dark:border-cyan-500/20 bg-cyan-50/50 dark:bg-slate-800/30 hover:bg-cyan-100/50 dark:hover:bg-slate-800/50 hover:border-cyan-500/50 group">
                <div className="flex items-center justify-center w-12 h-12 mb-3 transition-transform bg-white rounded-lg shadow-sm sm:mb-4 sm:h-14 sm:w-14 dark:bg-slate-700 group-hover:scale-110 group-hover:shadow-md">
                  <FiImage size={20} className="text-cyan-500" />
                </div>
                <p className=" text-xs  min-[400px]:text-base min-[500px]:text-[17px] font-bold text-slate-900 dark:text-white">
                  {t("addProduct.uploadImages")}
                </p>
                <p className="mt-1 text-[10px] font-medium sm:text-sm text-slate-500 dark:text-slate-400">
                  {t("addProduct.uploadFormats")} ({5 - images.length}{" "}
                  {t("addProduct.left")})
                </p>
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </label>
            )}

            <div className="p-4 mt-4 border rounded-lg sm:p-5 sm:mt-6 border-emerald-200/50 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 text-[11px] sm:text-[13px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <FiStar
                  size={14}
                  className="fill-emerald-600/20 dark:fill-emerald-400/20"
                />
                {t("addProduct.uploadTips")}
              </div>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-[14px] font-medium text-emerald-600/90 dark:text-emerald-400/80 leading-relaxed">
                {t("addProduct.uploadTipsDesc")}
              </p>
            </div>
          </section>

          <section className="mb-6 min-w-0 px-4 py-4 min-[400px]:p-6 transition-all duration-300 border shadow-lg rounded-xl border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:shadow-xl">
            <div className="grid grid-cols-1 gap-6">
              <label className="block">
                <span className="mb-2 block text-[10px] min-[800px]:text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  {t("addProduct.productName")}
                </span>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 16 Pro"
                  className="relative  h-10 min-[400px]:h-12  min-[800px]:h-14 w-full px-3 min-[800px]:px-5 outline-none transition-all text-xs min-[400px]:text-[13px]  min-[800px]:text-[15px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] min-[800px]:text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  {t("addProduct.shortDesc")}
                </span>
                <input
                  required
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Minimum 10 characters"
                  className="relative  h-10 min-[400px]:h-12  min-[800px]:h-14 w-full px-3 min-[800px]:px-5 outline-none transition-all text-xs min-[400px]:text-[13px]  min-[800px]:text-[15px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] min-[800px]:text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  {t("addProduct.description")}
                </span>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Minimum 20 characters"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 px-3 min-[800px]:px-5 py-4 text-xs min-[400px]:text-[13px]  min-[800px]:text-[15px] outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-400 text-slate-900 dark:text-white backdrop-blur-sm"
                ></textarea>
              </label>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[10px] min-[800px]:text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    {t("addProduct.price")}
                  </span>
                  <input
                    required
                    type="number"
                    step="1"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    className="relative  h-10 min-[400px]:h-12  min-[800px]:h-14 w-full px-3 min-[800px]:px-5 outline-none transition-all text-xs min-[400px]:text-[13px]  min-[800px]:text-[15px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] min-[800px]:text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    {t("addProduct.discountPrice")}
                  </span>
                  <input
                    type="number"
                    step="1"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    placeholder="0"
                    className="relative  h-10 min-[400px]:h-12  min-[800px]:h-14 w-full px-3 min-[800px]:px-5 outline-none transition-all text-xs min-[400px]:text-[13px]  min-[800px]:text-[15px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm"
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[10px] min-[800px]:text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    {t("addProduct.stock")}
                  </span>
                  <input
                    required
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    className="relative  h-10 min-[400px]:h-12  min-[800px]:h-14 w-full px-3 min-[800px]:px-5 outline-none transition-all text-xs min-[400px]:text-[13px]  min-[800px]:text-[15px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] min-[800px]:text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    {t("addProduct.sku")}
                  </span>
                  <input
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="e.g. IPH-16-PRO"
                    className="relative  h-10 min-[400px]:h-12  min-[800px]:h-14 w-full px-3 min-[800px]:px-5 outline-none transition-all text-xs min-[400px]:text-[13px]  min-[800px]:text-[15px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm"
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[10px] min-[800px]:text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    {t("addProduct.categoryLabel")}
                  </span>
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="relative h-10 min-[400px]:h-12  min-[800px]:h-14  w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 px-3 min-[800px]:px-5 text-xs min-[400px]:text-[13px]  min-[800px]:text-[15px] outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-900 dark:text-white backdrop-blur-sm"
                  >
                    <option value="">{t("addProduct.selectCategory")}</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Phones">Phones</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Sports">Sports</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] min-[800px]:text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    {t("addProduct.subcategoryLabel")}
                  </span>
                  <input
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    placeholder="e.g. smartphones"
                    className="relative  h-10 min-[400px]:h-12  min-[800px]:h-14 w-full px-3 min-[800px]:px-5 outline-none transition-all text-xs min-[400px]:text-[13px]  min-[800px]:text-[15px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-[10px] min-[800px]:text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  {t("addProduct.brand")}
                </span>
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Apple"
                  className="relative  h-10 min-[400px]:h-12  min-[800px]:h-14 w-full px-3 min-[800px]:px-5 outline-none transition-all text-xs min-[400px]:text-[13px]  min-[800px]:text-[15px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm"
                />
              </label>

              <div className="p-3 min-[400px]:p-6 border rounded-lg border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm">
                <label className="block">
                  <span className="mb-2 block text-[10px] min-[800px]:text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    {t("addProduct.tags")}
                  </span>
                  <div className="flex flex-wrap items-center min-w-0 gap-2">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder={t("addProduct.tagPlaceholder")}
                      className="flex-1 h-10 min-[400px]:h-12  min-[800px]:h-14 px-3 min-[800px]:px-5 text-xs transition-all border rounded-lg outline-none  text-xs min-[400px]:text-[13px]  min-[800px]:text-[15px] border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="flex items-center justify-center w-9 min-[400px]:w-10 h-9 min-[400px]:h-10 text-white transition-all rounded-lg shadow-lg cursor-pointer sm:w-12 sm:h-12 bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/30 dark:bg-cyan-500 dark:hover:bg-cyan-600 shrink-0"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                </label>
                <div className="flex flex-wrap gap-1.5 min-[400px]:gap-2 mt-4">
                  {tags.length === 0 && (
                    <p className="text-xs  min-[400px]:text-sm font-medium text-slate-500 dark:text-slate-400">
                      {t("addProduct.tagHint")}
                    </p>
                  )}
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-md min-[400px]:rounded-lg border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-2 min-[400px]:px-3 py-1.5  text-[10px]  min-[400px]:text-[13px] font-semibold text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="transition-colors cursor-pointer text-slate-400 hover:text-rose-500"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                <label className="flex items-center justify-center flex-1 gap-1.5 min-[400px]:gap-3 px-3 min-[400px]:px-6 py-2 min-[400px]:py-4 transition-all border rounded-lg shadow-sm cursor-pointer sm:flex-none border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 backdrop-blur-sm">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-3 w-3 min-[400px]:w-3 min-[400px]:h-3 min-[600px]:w-5 min-[600px]:h-5 accent-cyan-500"
                  />
                  <span className="text-xs min-[400px]:text-sm  min-[600px]:text-[15px] font-bold text-slate-700 dark:text-slate-300">
                    {t("addProduct.featuredLabel")}
                  </span>
                </label>
                <label className="flex items-center justify-center flex-1 gap-1.5 min-[400px]:gap-3 px-3 min-[400px]:px-6 py-2 min-[400px]:py-4 transition-all border rounded-lg shadow-sm cursor-pointer sm:flex-none border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 backdrop-blur-sm">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-3 w-3 min-[400px]:w-3 min-[400px]:h-3 min-[600px]:w-5 min-[600px]:h-5 accent-cyan-500"
                  />
                  <span className="text-xs min-[400px]:text-sm  min-[600px]:text-[15px] font-bold text-slate-700 dark:text-slate-300">
                    {t("addProduct.activeLabel")}
                  </span>
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-start gap-2 min-[400px]:gap-3 pt-6 pb-3 mt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                <Link
                  to="/products"
                  className="flex items-center justify-center gap-2 rounded-md min-[400px]:rounded-lg px-3 min-[400px]:px-6 py-1.5 min-[400px]:py-3 text-[10px] min-[400px]:text-[12px] min-[600px]:text-[14px] font-bold transition-all bg-white/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 active:scale-[0.98] backdrop-blur-sm"
                >
                  {t("addProduct.cancel")}
                </Link>
                <button
                  disabled={loading}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-md min-[400px]:rounded-lg px-3 min-[400px]:px-6 py-1.5 min-[400px]:py-3 text-[10px] min-[400px]:text-[12px] min-[600px]:text-[14px] font-bold transition-all bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-600 hover:to-sky-600 hover:shadow-xl hover:shadow-cyan-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" size={16} />{" "}
                      {t("addProduct.creating")}
                    </>
                  ) : (
                    t("addProduct.createProductBtn")
                  )}
                </button>
              </div>
            </div>
          </section>
        </form>
        <ToastContainer position="bottom-right" theme="colored" />
      </div>
    </main>
  );
}
