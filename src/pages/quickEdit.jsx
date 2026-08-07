// import { useState, useRef } from "react";
// import { FiX, FiImage, FiLoader, FiPlus } from "react-icons/fi";
// import { toast } from "react-toastify";
// import api from "../api/api";
// import { useLanguage } from "../Context/LanguageContext";

// export default function QuickEdit({
//   product: initialProduct,
//   onClose,
//   onSuccess,
// }) {
//   const { t } = useLanguage();
//   const [product, setProduct] = useState({
//     _id: initialProduct?._id,
//     name: initialProduct?.name || initialProduct?.title || "",
//     shortDescription: initialProduct?.shortDescription || "",
//     description: initialProduct?.description || "",
//     price: initialProduct?.price || "",
//     discountPrice: initialProduct.discountPrice || "",
//     stock: initialProduct?.stock || "",
//     sku: initialProduct?.sku || "",
//     category: initialProduct?.category || "",
//     subcategory: initialProduct?.subcategory || "",
//     brand: initialProduct?.brand || "",
//     featured: initialProduct?.featured || false,
//     isActive:
//       initialProduct.isActive !== undefined
//         ? initialProduct.isActive
//         : initialProduct.active !== undefined
//           ? initialProduct.active
//           : true,
//   });

//   const [loading, setLoading] = useState(false);
//   const [tags, setTags] = useState(
//     Array.isArray(initialProduct.tags) ? initialProduct.tags : [],
//   );
//   const [tagInput, setTagInput] = useState("");

//   const fileInputRef = useRef(null);

//   const [existingImages, setExistingImages] = useState(
//     initialProduct.images || [],
//   );
//   const [deletedImages, setDeletedImages] = useState([]);
//   const [newImages, setNewImages] = useState([]);

//   const imagePreviews = [
//     ...existingImages.map((img) =>
//       typeof img === "string" ? img : img.url || "",
//     ),
//     ...newImages.map((file) => URL.createObjectURL(file)),
//   ];

//   const triggerFileUpload = () => fileInputRef.current?.click();

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     const availableSlots = 5 - imagePreviews.length;
//     const allowedFiles = files.slice(0, availableSlots);

//     if (files.length > availableSlots) {
//       toast.error(
//         `You can only upload up to 5 images. Only ${allowedFiles.length} were added.`,
//       );
//     }

//     if (allowedFiles.length === 0) return;
//     setNewImages((prev) => [...prev, ...allowedFiles]);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const removeImage = (index) => {
//     if (index < existingImages.length) {
//       const imgToRemove = existingImages[index];
//       if (imgToRemove && imgToRemove.public_id) {
//         setDeletedImages((prev) => [...prev, imgToRemove.public_id]);
//       }
//       setExistingImages((prev) => prev.filter((_, idx) => idx !== index));
//     } else {
//       const newIndex = index - existingImages.length;
//       setNewImages((prev) => prev.filter((_, idx) => idx !== newIndex));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setProduct((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleAddTag = () => {
//     const trimmed = tagInput.trim();
//     if (trimmed && !tags.includes(trimmed)) {
//       setTags((prev) => [...prev, trimmed]);
//       setTagInput("");
//     }
//   };

//   const handleRemoveTag = (tagToRemove) => {
//     setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
//   };

//   const handleTagKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddTag();
//     }
//   };

//   const handleSave = async (e) => {
//     if (e) e.preventDefault();
//     if (imagePreviews.length === 0) {
//       return toast.error("Please ensure there is at least one image.");
//     }

//     setLoading(true);

//     try {
//       const data = new FormData();
//       Object.keys(product).forEach((key) => {
//         if (key !== "_id" && product[key] !== "") {
//           data.append(key, product[key]);
//         }
//       });

//       if (tags.length > 0) {
//         if (tags.length === 1) {
//           data.append("tags", tags[0]);
//           data.append("tags", tags[0]);
//         } else {
//           tags.forEach((tag) => data.append("tags", tag));
//         }
//       }

//       newImages.forEach((image) => {
//         data.append("images", image);
//       });

//       if (deletedImages.length > 0) {
//         data.append("deletedImages", JSON.stringify(deletedImages));
//       }
       
//       await api.patch(`/products/update/${product._id}`, data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("Product updated successfully!");
//       onSuccess();
//     } catch (err) {
//       console.error("Update Error:", err);
//       if (err.response?.data?.errors) {
//         const errs = err.response.data.errors;
//         if (Array.isArray(errs) && errs.length > 0) {
//           toast.error(errs.join(", "));
//         } else if (typeof errs === "string") {
//           toast.error(errs);
//         } else {
//           toast.error(JSON.stringify(errs));
//         }
//       } else {
//         toast.error(err.response?.data?.message || "Failed to update product");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const categories = [
//     "Electronics",
//     "Phones",
//     "Fashion",
//     "Home",
//     "Beauty",
//     "Sports",
//   ];
//   const formatCategory = (cat) => {
//     if (!cat) return "";
//     const matched = categories.find(
//       (opt) => opt.toLowerCase() === cat.toLowerCase(),
//     );
//     return matched || cat;
//   };

//   return (
//     <div
//       className="slide-up fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-2 sm:p-4 backdrop-blur-sm transition-all"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[92vh] border border-slate-200 dark:border-slate-700">
//         <div className="flex items-center justify-between px-4 py-3 border-b sm:px-6 sm:py-4 border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50/80 dark:bg-slate-900/80">
//           <h2 className="text-base font-extrabold tracking-tight truncate sm:text-xl text-slate-900 dark:text-white">
//             {t("quickEdit.title")}
//           </h2>
//           <button
//             onClick={onClose}
//             className="flex items-center justify-center w-8 h-8 transition-colors rounded-full cursor-pointer bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white shrink-0"
//           >
//             <FiX size={18} />
//           </button>
//         </div>

//         <div className="flex-1 p-3 overflow-y-auto sm:p-6 custom-scrollbar">
//           <form className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12">
//             <div className="flex flex-col gap-4 sm:gap-6 md:col-span-4">
//               <div className="p-3 border sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-slate-200 dark:border-slate-700">
//                 <label className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 block">
//                   {t("quickEdit.media")} ({imagePreviews.length}/5)
//                 </label>
//                 <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-2 sm:gap-3">
//                   {imagePreviews.map((img, num) => (
//                     <div
//                       key={num}
//                       className="group  relative  h-auto  min-[500px]:h-[200px] min-[768px]:h-auto w-auto min-[500px]:w-full  min-[768px]:w-auto overflow-hidden border rounded-lg group aspect-square bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
//                     >
//                       <img
//                         src={img}
//                         alt="Product"
//                         className="object-cover w-full h-full overflow-object"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeImage(num)}
//                         className="absolute flex items-center justify-center w-5 h-5 text-white transition-opacity bg-red-500 rounded-full shadow-md opacity-0 cursor-pointer hover:bg-red-600 sm:w-6 sm:h-6 top-1 right-1 group-hover:opacity-100"
//                       >
//                         <FiX size={10} />
//                       </button>
//                     </div>
//                   ))}
//                   {imagePreviews.length < 5 && (
//                     <div
//                       onClick={triggerFileUpload}
//                       className="flex flex-col h-auto  min-[500px]:h-[200px] min-[768px]:h-auto w-auto  min-[500px]:w-full min-[768px]:w-auto items-center justify-center transition-colors border-2 border-dashed rounded-lg cursor-pointer border-cyan-400/50 bg-cyan-50/50 dark:border-cyan-500/30 dark:bg-slate-800/30 hover:bg-cyan-100/50 dark:hover:bg-slate-800/50 aspect-square"
//                     >
//                       <FiImage
//                         className="mb-1 text-cyan-500 dark:text-cyan-400"
//                         size={16}
//                       />
//                       <span className="text-[8px] sm:text-[10px] font-bold text-cyan-500 dark:text-cyan-400 text-center">
//                         {t("quickEdit.upload")}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleImageUpload}
//                   style={{ display: "none" }}
//                   multiple
//                   accept="image/*"
//                 />
//               </div>

//               <div className="p-3 border sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-slate-200 dark:border-slate-700">
//                 <label className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 block">
//                   {t("quickEdit.status")}
//                 </label>
//                 <div className="flex flex-col gap-2 sm:gap-3">
//                   <label className="flex items-center gap-2 cursor-pointer sm:gap-3 group">
//                     <input
//                       type="checkbox"
//                       name="featured"
//                       checked={product.featured}
//                       onChange={handleChange}
//                       className="w-4 h-4 rounded sm:w-5 sm:h-5 accent-cyan-500 border-slate-300 dark:border-slate-600"
//                     />
//                     <span className="text-xs font-semibold transition-colors sm:text-sm text-slate-700 dark:text-slate-300 group-hover:text-cyan-500">
//                       {t("quickEdit.featuredProduct")}
//                     </span>
//                   </label>
//                   <label className="flex items-center gap-2 cursor-pointer sm:gap-3 group">
//                     <input
//                       type="checkbox"
//                       name="isActive"
//                       checked={product.isActive}
//                       onChange={handleChange}
//                       className="w-4 h-4 rounded sm:w-5 sm:h-5 accent-cyan-500 border-slate-300 dark:border-slate-600"
//                     />
//                     <span className="text-xs font-semibold transition-colors sm:text-sm text-slate-700 dark:text-slate-300 group-hover:text-cyan-500">
//                       {t("quickEdit.activeListing")}
//                     </span>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col gap-4 sm:gap-5 md:col-span-8">
//               <div className="grid grid-cols-1 gap-3 sm:gap-5 sm:grid-cols-2">
//                 <div className="flex flex-col gap-1.5 sm:col-span-2">
//                   <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
//                     {t("addProduct.productName")}
//                   </label>
//                   <input
//                     name="name"
//                     value={product.name}
//                     onChange={handleChange}
//                     className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
//                     required
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1.5 sm:col-span-2">
//                   <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
//                     {t("addProduct.shortDesc")}
//                   </label>
//                   <input
//                     name="shortDescription"
//                     value={product.shortDescription}
//                     onChange={handleChange}
//                     className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
//                     required
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
//                     {t("addProduct.price")}
//                   </label>
//                   <input
//                     name="price"
//                     type="number"
//                     value={product.price}
//                     onChange={handleChange}
//                     className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
//                     min="0"
//                     step="1"
//                     required
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
//                     {t("addProduct.discountPrice")}
//                   </label>
//                   <input
//                     name="discountPrice"
//                     type="number"
//                     value={product.discountPrice}
//                     onChange={handleChange}
//                     className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
//                     min="0"
//                     step="1"
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
//                     {t("addProduct.stock")}
//                   </label>
//                   <input
//                     name="stock"
//                     type="number"
//                     value={product.stock}
//                     onChange={handleChange}
//                     className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
//                     min="0"
//                     required
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
//                     {t("addProduct.sku")}
//                   </label>
//                   <input
//                     name="sku"
//                     value={product.sku}
//                     onChange={handleChange}
//                     placeholder={t("addProduct.skuPlaceholder") || "Enter SKU"}
//                     className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
//                     {t("addProduct.categoryLabel")}
//                   </label>
//                   <select
//                     name="category"
//                     value={formatCategory(product.category)}
//                     onChange={handleChange}
//                     className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
//                     required
//                   >
//                     <option value="">{t("addProduct.selectCategory")}</option>
//                     {categories.map((c) => (
//                       <option key={c} value={c}>
//                         {c}
//                       </option>
//                     ))}
//                     {product.category &&
//                       !categories.includes(
//                         formatCategory(product.category),
//                       ) && (
//                         <option value={product.category}>
//                           {product.category}
//                         </option>
//                       )}
//                   </select>
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
//                     {t("addProduct.brand")}
//                   </label>
//                   <input
//                     name="brand"
//                     value={product.brand}
//                     onChange={handleChange}
//                     className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1.5 sm:col-span-2">
//                   <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
//                     {t("addProduct.tags")}
//                   </label>
//                   <div className="flex flex-wrap items-center gap-2">
//                     <input
//                       value={tagInput}
//                       onChange={(e) => setTagInput(e.target.value)}
//                       onKeyDown={handleTagKeyDown}
//                       className="flex-1 h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
//                       placeholder={t("addProduct.tagPlaceholder")}
//                     />
//                     <button
//                       type="button"
//                       onClick={handleAddTag}
//                       className="flex items-center justify-center w-9 min-[400px]:w-10 h-9 min-[400px]:h-10 text-white transition-all rounded-lg shadow-lg cursor-pointer sm:w-12 sm:h-12 bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/30 dark:bg-cyan-500 dark:hover:bg-cyan-600 shrink-0"
//                     >
//                       <FiPlus size={16} />
//                     </button>
//                   </div>
//                   {tags.length > 0 && (
//                     <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
//                       {tags.map((tag, index) => (
//                         <span
//                           key={index}
//                           className="inline-flex items-center gap-1 sm:gap-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] sm:text-[12px] font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
//                         >
//                           {tag}
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveTag(tag)}
//                             className="transition-colors cursor-pointer text-slate-400 hover:text-red-500 dark:hover:text-red-400"
//                           >
//                             <FiX size={12} />
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>

//         <div className="flex flex-col-reverse justify-end gap-2 px-4 py-3 border-t sm:flex-row sm:gap-3 sm:px-6 sm:py-4 border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50/80 dark:bg-slate-900/80">
//           <button
//             type="button"
//             onClick={onClose}
//             className="w-full text-xs min-[400px]:text-sm  min-[500px]:text-base sm:w-auto px-4 sm:px-6 py-2.5 text-sm cursor-pointer font-bold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:hover:border-slate-600 rounded-lg transition-all"
//           >
//             {t("quickEdit.cancel")}
//           </button>
//           <button
//             type="button"
//             onClick={handleSave}
//             disabled={loading}
//             className="w-full text-xs min-[400px]:text-sm  min-[500px]:text-base sm:w-auto flex items-center cursor-pointer justify-center gap-2 px-4 sm:px-8 py-2.5 bg-cyan-500 hover:bg-cyan-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 rounded-lg text-sm font-bold text-white shadow-lg shadow-cyan-500/30 dark:shadow-cyan-500/20 transition-all"
//           >
//             {loading ? (
//               <>
//                 <FiLoader className="animate-spin" size={16} />{" "}
//                 {t("quickEdit.saving")}
//               </>
//             ) : (
//               t("quickEdit.saveChanges")
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useRef } from "react";
import { FiX, FiImage, FiLoader, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../api/api";
import { useLanguage } from "../Context/LanguageContext";

export default function QuickEdit({
  product: initialProduct,
  onClose,
  onSuccess,
}) {
  const { t } = useLanguage();
  
  // ✅ التحقق من وجود initialProduct
  console.log("🔍 QuickEdit - initialProduct:", initialProduct);
  
  // ✅ فحص: إذا لم يكن هناك product، أغلق المودال
  if (!initialProduct || !initialProduct._id) {
    console.error("❌ QuickEdit: No product data provided");
    toast.error("Product data is missing. Please refresh and try again.");
    onClose();
    return null;
  }
  
  const [product, setProduct] = useState({
    _id: initialProduct?._id || "",
    name: initialProduct?.name || initialProduct?.title || "",
    shortDescription: initialProduct?.shortDescription || "",
    description: initialProduct?.description || "",
    price: initialProduct?.price || "",
    discountPrice: initialProduct?.discountPrice || "",
    stock: initialProduct?.stock || "",
    sku: initialProduct?.sku || "",
    category: initialProduct?.category || "",
    subcategory: initialProduct?.subcategory || "",
    brand: initialProduct?.brand || "",
    featured: initialProduct?.featured || false,
    isActive:
      initialProduct?.isActive !== undefined
        ? initialProduct.isActive
        : initialProduct?.active !== undefined
          ? initialProduct.active
          : true,
  });

  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState(
    Array.isArray(initialProduct?.tags) ? initialProduct.tags : [],
  );
  const [tagInput, setTagInput] = useState("");

  const fileInputRef = useRef(null);

  const [existingImages, setExistingImages] = useState(
    initialProduct?.images || [],
  );
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const imagePreviews = [
    ...existingImages.map((img) =>
      typeof img === "string" ? img : img.url || "",
    ),
    ...newImages.map((file) => URL.createObjectURL(file)),
  ];

  const triggerFileUpload = () => fileInputRef.current?.click();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const availableSlots = 5 - imagePreviews.length;
    const allowedFiles = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      toast.error(
        `You can only upload up to 5 images. Only ${allowedFiles.length} were added.`,
      );
    }

    if (allowedFiles.length === 0) return;
    setNewImages((prev) => [...prev, ...allowedFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    // ✅ التأكد من أن deletedImages هي مصفوفة
    const currentExisting = existingImages || [];
    
    if (index < currentExisting.length) {
      const imgToRemove = currentExisting[index];
      if (imgToRemove && imgToRemove.public_id) {
        setDeletedImages((prev) => {
          const safePrev = Array.isArray(prev) ? prev : [];
          return [...safePrev, imgToRemove.public_id];
        });
      }
      setExistingImages((prev) => (prev || []).filter((_, idx) => idx !== index));
    } else {
      const newIndex = index - currentExisting.length;
      setNewImages((prev) => (prev || []).filter((_, idx) => idx !== newIndex));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    // ✅ فحص: تأكد من وجود product._id
    if (!product?._id) {
      console.error("❌ Product ID is missing:", product);
      return toast.error("Product ID is missing. Please refresh and try again.");
    }

    if (imagePreviews.length === 0) {
      return toast.error("Please ensure there is at least one image.");
    }

    setLoading(true);

    try {
      const data = new FormData();
      
      // ✅ إضافة بيانات المنتج (تجاهل الحقول الفارغة)
      Object.keys(product).forEach((key) => {
        const value = product[key];
        if (key !== "_id" && value !== "" && value !== null && value !== undefined) {
          // ✅ تحويل القيم المنطقية إلى string
          if (typeof value === 'boolean') {
            data.append(key, String(value));
          } else {
            data.append(key, value);
          }
        }
      });

      // ✅ التأكد من أن tags هي مصفوفة
      const safeTags = Array.isArray(tags) ? tags : [];
      if (safeTags.length > 0) {
        safeTags.forEach((tag) => data.append("tags", tag));
      }

      // ✅ التأكد من أن newImages هي مصفوفة
      const safeNewImages = Array.isArray(newImages) ? newImages : [];
      safeNewImages.forEach((image) => {
        data.append("images", image);
      });

      // ✅ التأكد من أن deletedImages هي مصفوفة
      const safeDeletedImages = Array.isArray(deletedImages) ? deletedImages : [];
      if (safeDeletedImages.length > 0) {
        data.append("deletedImages", JSON.stringify(safeDeletedImages));
      }

      console.log("📦 FormData entries:");
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      const response = await api.patch(`/products/update/${product._id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated successfully!");
      onSuccess();
    } catch (err) {
      console.error("❌ Update Error:", err);
      console.error("❌ Error details:", err.response?.data);
      
      if (err.response?.data?.errors) {
        const errs = err.response.data.errors;
        if (Array.isArray(errs) && errs.length > 0) {
          toast.error(errs.join(", "));
        } else if (typeof errs === "string") {
          toast.error(errs);
        } else {
          toast.error(JSON.stringify(errs));
        }
      } else {
        toast.error(err.response?.data?.message || "Failed to update product");
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Electronics",
    "Phones",
    "Fashion",
    "Home",
    "Beauty",
    "Sports",
  ];
  const formatCategory = (cat) => {
    if (!cat) return "";
    const matched = categories.find(
      (opt) => opt.toLowerCase() === cat.toLowerCase(),
    );
    return matched || cat;
  };

  return (
    <div
      className="slide-up fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-2 sm:p-4 backdrop-blur-sm transition-all"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[92vh] border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-3 border-b sm:px-6 sm:py-4 border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50/80 dark:bg-slate-900/80">
          <h2 className="text-base font-extrabold tracking-tight truncate sm:text-xl text-slate-900 dark:text-white">
            {t("quickEdit.title")}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full cursor-pointer bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white shrink-0"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="flex-1 p-3 overflow-y-auto sm:p-6 custom-scrollbar">
          <form className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12">
            <div className="flex flex-col gap-4 sm:gap-6 md:col-span-4">
              <div className="p-3 border sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-slate-200 dark:border-slate-700">
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 block">
                  {t("quickEdit.media")} ({imagePreviews.length}/5)
                </label>
                <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-2 sm:gap-3">
                  {imagePreviews.map((img, num) => (
                    <div
                      key={num}
                      className="group  relative  h-auto  min-[500px]:h-[200px] min-[768px]:h-auto w-auto min-[500px]:w-full  min-[768px]:w-auto overflow-hidden border rounded-lg group aspect-square bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    >
                      <img
                        src={img}
                        alt="Product"
                        className="object-cover w-full h-full overflow-object"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(num)}
                        className="absolute flex items-center justify-center w-5 h-5 text-white transition-opacity bg-red-500 rounded-full shadow-md opacity-0 cursor-pointer hover:bg-red-600 sm:w-6 sm:h-6 top-1 right-1 group-hover:opacity-100"
                      >
                        <FiX size={10} />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 5 && (
                    <div
                      onClick={triggerFileUpload}
                      className="flex flex-col h-auto  min-[500px]:h-[200px] min-[768px]:h-auto w-auto  min-[500px]:w-full min-[768px]:w-auto items-center justify-center transition-colors border-2 border-dashed rounded-lg cursor-pointer border-cyan-400/50 bg-cyan-50/50 dark:border-cyan-500/30 dark:bg-slate-800/30 hover:bg-cyan-100/50 dark:hover:bg-slate-800/50 aspect-square"
                    >
                      <FiImage
                        className="mb-1 text-cyan-500 dark:text-cyan-400"
                        size={16}
                      />
                      <span className="text-[8px] sm:text-[10px] font-bold text-cyan-500 dark:text-cyan-400 text-center">
                        {t("quickEdit.upload")}
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  multiple
                  accept="image/*"
                />
              </div>

              <div className="p-3 border sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-slate-200 dark:border-slate-700">
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 block">
                  {t("quickEdit.status")}
                </label>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label className="flex items-center gap-2 cursor-pointer sm:gap-3 group">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={product.featured}
                      onChange={handleChange}
                      className="w-4 h-4 rounded sm:w-5 sm:h-5 accent-cyan-500 border-slate-300 dark:border-slate-600"
                    />
                    <span className="text-xs font-semibold transition-colors sm:text-sm text-slate-700 dark:text-slate-300 group-hover:text-cyan-500">
                      {t("quickEdit.featuredProduct")}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer sm:gap-3 group">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={product.isActive}
                      onChange={handleChange}
                      className="w-4 h-4 rounded sm:w-5 sm:h-5 accent-cyan-500 border-slate-300 dark:border-slate-600"
                    />
                    <span className="text-xs font-semibold transition-colors sm:text-sm text-slate-700 dark:text-slate-300 group-hover:text-cyan-500">
                      {t("quickEdit.activeListing")}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-5 md:col-span-8">
              <div className="grid grid-cols-1 gap-3 sm:gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                    {t("addProduct.productName")}
                  </label>
                  <input
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                    {t("addProduct.shortDesc")}
                  </label>
                  <input
                    name="shortDescription"
                    value={product.shortDescription}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                    {t("addProduct.price")}
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    min="0"
                    step="1"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                    {t("addProduct.discountPrice")}
                  </label>
                  <input
                    name="discountPrice"
                    type="number"
                    value={product.discountPrice}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    min="0"
                    step="1"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                    {t("addProduct.stock")}
                  </label>
                  <input
                    name="stock"
                    type="number"
                    value={product.stock}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    min="0"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                    {t("addProduct.sku")}
                  </label>
                  <input
                    name="sku"
                    value={product.sku}
                    onChange={handleChange}
                    placeholder={t("addProduct.skuPlaceholder") || "Enter SKU"}
                    className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                    {t("addProduct.categoryLabel")}
                  </label>
                  <select
                    name="category"
                    value={formatCategory(product.category)}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    required
                  >
                    <option value="">{t("addProduct.selectCategory")}</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    {product.category &&
                      !categories.includes(
                        formatCategory(product.category),
                      ) && (
                        <option value={product.category}>
                          {product.category}
                        </option>
                      )}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                    {t("addProduct.brand")}
                  </label>
                  <input
                    name="brand"
                    value={product.brand}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] sm:text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                    {t("addProduct.tags")}
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="flex-1 h-10 px-3 text-xs transition-all bg-white border rounded-lg sm:h-12 sm:px-4 sm:text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      placeholder={t("addProduct.tagPlaceholder")}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="flex items-center justify-center w-9 min-[400px]:w-10 h-9 min-[400px]:h-10 text-white transition-all rounded-lg shadow-lg cursor-pointer sm:w-12 sm:h-12 bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/30 dark:bg-cyan-500 dark:hover:bg-cyan-600 shrink-0"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 sm:gap-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] sm:text-[12px] font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="transition-colors cursor-pointer text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                          >
                            <FiX size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex flex-col-reverse justify-end gap-2 px-4 py-3 border-t sm:flex-row sm:gap-3 sm:px-6 sm:py-4 border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50/80 dark:bg-slate-900/80">
          <button
            type="button"
            onClick={onClose}
            className="w-full text-xs min-[400px]:text-sm  min-[500px]:text-base sm:w-auto px-4 sm:px-6 py-2.5 text-sm cursor-pointer font-bold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:hover:border-slate-600 rounded-lg transition-all"
          >
            {t("quickEdit.cancel")}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full text-xs min-[400px]:text-sm  min-[500px]:text-base sm:w-auto flex items-center cursor-pointer justify-center gap-2 px-4 sm:px-8 py-2.5 bg-cyan-500 hover:bg-cyan-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 rounded-lg text-sm font-bold text-white shadow-lg shadow-cyan-500/30 dark:shadow-cyan-500/20 transition-all"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" size={16} />{" "}
                {t("quickEdit.saving")}
              </>
            ) : (
              t("quickEdit.saveChanges")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}