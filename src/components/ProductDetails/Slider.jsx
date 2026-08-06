import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import Products from "../../pages/Products";

// استقبلنا الـ images كـ prop هنا
export default function Slider({ images }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);

  // The API returns image objects ({ url }), while local previews can be URL strings.
  // Normalize both shapes before passing values to the img `src` attribute.
  const imageList = (Array.isArray(images) ? images : [])
    .map((image) => (typeof image === "string" ? image : image?.url))
    .filter(Boolean);

  if (!imageList.length) {
    return (
      <div className="flex items-center justify-center text-sm border h-80 rounded-xl border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        No images available
      </div>
    );
  }

  return (
    <div className="w-full ">
      <Swiper
        loop={Products.length > 4}
        spaceBetween={8}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Autoplay, FreeMode, Thumbs]}
        className="p-2 xs:p-3 sm:p-4 mb-3 xs:mb-4 border shadow-sm rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900"
        onSwiper={(swiper) => {
          mainSwiperRef.current = swiper;
        }}
        breakpoints={{
          320: {
            spaceBetween: 6,
          },
          375: {
            spaceBetween: 8,
          },
          640: {
            spaceBetween: 10,
          },
          768: {
            spaceBetween: 12,
          },
          1024: {
            spaceBetween: 15,
          },
        }}
      >
        {imageList.map((imageUrl, index) => (
          <SwiperSlide key={index}>
            <img
              src={imageUrl}
              alt={`Product ${index + 1}`}
              className="object-contain w-full cursor-pointer h-32 sm:h-48 md:h-52 lg:h-60 rounded-md sm:rounded-lg transition-transform hover:scale-105"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={(swiper) => {
          setThumbsSwiper(swiper);
        }}
        loop={true}
        spaceBetween={8}
        slidesPerView="auto"
        freeMode={true}
        watchSlidesProgress={true}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        modules={[FreeMode, Thumbs, Autoplay]}
        className="p-2 mt-3  sm:mt-6 xs:p-3 sm:p-4 thumbs-slider h-32 min-[600px]:h-40 min-[800px]:h-40 min-[1024px]:h-44   "
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          320: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          375: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
        }}
      >
        {imageList.map((imageUrl, index) => (
          <SwiperSlide
            key={`thumb-${index}`}
            className="relative bg-white shadow-sm  rounded-md sm:rounded-lg dark:bg-slate-800 "
          >
            <img
              src={imageUrl}
              alt={`Thumbnail ${index + 1}`}
              className="relative  w-full h-full  rounded-md sm:rounded-lg object-cover cursor-pointer transition-all hover:scale-105 hover:shadow-md"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
