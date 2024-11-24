import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { IoHeartCircle } from "react-icons/io5";
import { MainAppContext } from "@/context/MainContext";
import { AppContext } from "@/context/AppContext";
import { FaTag } from "react-icons/fa";

export default function Featured2({
  products,
  newProducts,
  filteredCategory,
  wishlistedProducts,
}) {
  const [screenSize, setScreenSize] = useState("");

  const {
    handleAddToWishlist,
    handleRemoveWishlist,
    productPageId,
    setProductPageId,
  } = useContext(MainAppContext);
  const { currency } = useContext(AppContext);
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 600) {
        setScreenSize(2);
      } else if (width >= 600 && width < 1024) {
        setScreenSize(4);
      } else {
        setScreenSize(5);
      }
    }

    // Add event listener to listen for resize events
    window.addEventListener("resize", handleResize);

    // Call handleResize initially to set the initial screen size
    handleResize();
    console.log(products);
    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div className="xl:hidden grid grid-cols-2 gap-4 px-[2%] pb-20">
        {products?.filter((e) => {
          if (filteredCategory === "New Arrivals") {
            return e?.approved;
          } else if (filteredCategory === "Featured") {
            return e?.approved && e.featured === true;
          } else {
            return (
              e?.approved &&
              (e.superCategory || e.mainCategory === filteredCategory)
            );
          }
        })?.length > 0 ? (
          products
            ?.filter((e) => {
              if (filteredCategory === "New Arrivals") {
                return e?.approved;
              } else if (filteredCategory === "Featured") {
                return e?.approved && e.featured === true;
              } else {
                return (
                  e?.approved &&
                  (e.superCategory || e.mainCategory === filteredCategory)
                );
              }
            })
            .map((pro, index) => (
              <div className="relative border-2 border-gray-300 hover:shadow-lg hover:border-gray-500 transition-all duration-300 rounded-lg" key={index}>
                <Link
                  to={`/product/${pro?.title?.replace(/\//g, "").replace(/\s+/g, "-")}`}
                  onClick={() => {
                    sessionStorage.setItem("productPageId", JSON.stringify(pro?._id));
                    setProductPageId(pro?._id);
                  }}
                  className="flex flex-col"
                >
                  <img
                    className="h-[220px] w-full lg:h-[250px] xl:h-[310px] object-cover rounded-t-lg"
                    // className="h-full w-full object-cover rounded-t-lg"
                    src={pro.mainImage}
                    alt="product-img"
                  />
                  <div className="p-3">
                    {/* Subcategory */}
                    <p className="text-sm text-gray-500">{pro.subCategory}</p>
                    {/* Product Title */}
                    <p className="text-lg font-semibold text-gray-900 truncate">{pro.title}</p>
                    {/* Price Section */}
                    <div className="flex items-center justify-start mt-2">
                      {pro?.discountValue > 0 && pro?.discountValue !== null ? (
                        <>
                          <p className="font-semibold text-gray-900 text-lg">
                            {currency}{" "}
                            {currency === "OMR"
                              ? (pro.discountValue * 0.1).toFixed(2)
                              : pro.discountValue.toFixed(2)}
                          </p>
                          <p className="font-semibold text-gray-400 line-through ml-2 text-sm">
                            {currency}{" "}
                            {currency === "OMR"
                              ? (pro.price * 0.1).toFixed(2)
                              : pro.price}
                          </p>
                        </>
                      ) : (
                        <p className="font-semibold text-lg">
                          {currency}{" "}
                          {currency === "OMR" ? (pro.price * 0.1).toFixed(2) : pro.price}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="absolute top-3 right-3">
                  {wishlistedProducts.find((i) => i?.productId?._id === pro?._id) ? (
                    <IoHeartCircle
                      onClick={() => handleRemoveWishlist(pro?._id)}
                      className="cursor-pointer hover:text-red-500 text-[25px] text-red-500"
                    />
                  ) : (
                    <IoHeartCircle
                      onClick={() => handleAddToWishlist(pro?._id)}
                      className="cursor-pointer hover:text-red-500 text-[25px] text-gray-600"
                    />
                  )}
                </div>
              </div>

            ))
        ) : (
          <p className="text-center text-xs w-full sm:text-sm">
            No products available in this category
          </p>
        )}
      </div>

      <div className="hidden xl:grid grid-cols-5 gap-4 px-[2%] pb-20">
        {products?.filter((e) => {
          if (filteredCategory === "New Arrivals") {
            return e?.approved;
          } else if (filteredCategory === "Featured") {
            return e?.approved && e.featured === true;
          } else {
            return (
              e?.approved &&
              (e.superCategory || e.mainCategory === filteredCategory)
            );
          }
        })?.length > 0 ? (
          products
            ?.filter((e) => {
              if (filteredCategory === "New Arrivals") {
                return e?.approved;
              } else if (filteredCategory === "Featured") {
                return e?.approved && e.featured === true;
              } else {
                return (
                  e?.approved &&
                  (e.superCategory || e.mainCategory === filteredCategory)
                );
              }
            })
            .map((pro, index) => (
              <div className="relative border-2 border-gray-300 hover:shadow-lg hover:border-gray-500 transition-all duration-300 rounded-lg" key={index}>
                <Link
                  to={`/product/${pro?.title?.replace(/\//g, "").replace(/\s+/g, "-")}`}
                  onClick={() => {
                    sessionStorage.setItem("productPageId", JSON.stringify(pro?._id));
                    setProductPageId(pro?._id);
                  }}
                  className="flex flex-col"
                >
                  <img
                    className="h-[220px] w-full lg:h-[250px] xl:h-[310px] object-cover rounded-t-lg"
                    src={pro.mainImage}
                    alt="product-img"
                  />
                  <div className="p-3">
                    <p className="text-sm text-gray-500">{pro.subCategory}</p>
                    <p className="text-lg font-semibold text-gray-900 truncate">{pro.title}</p>
                    <div className="flex items-center justify-start mt-2">
                      {pro?.discountValue > 0 && pro?.discountValue !== null ? (
                        <>
                          <p className="font-semibold text-gray-900 text-lg">
                            {currency} {pro.discountValue.toFixed(2)}
                          </p>
                          <p className="font-semibold text-gray-400 line-through ml-2 text-sm">
                            {currency} {pro.price}
                          </p>
                        </>
                      ) : (
                        <p className="font-semibold text-lg">
                          {currency} {pro.price}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="absolute top-3 right-3">
                  {wishlistedProducts.find((i) => i?.productId?._id === pro?._id) ? (
                    <IoHeartCircle
                      onClick={() => handleRemoveWishlist(pro?._id)}
                      className="cursor-pointer hover:text-red-500 text-[25px] text-red-500"
                    />
                  ) : (
                    <IoHeartCircle
                      onClick={() => handleAddToWishlist(pro?._id)}
                      className="cursor-pointer hover:text-red-500 text-[25px] text-gray-600"
                    />
                  )}
                </div>
              </div>
            ))
        ) : (
          <p className="text-center text-xs w-full sm:text-sm">No products available in this category</p>
        )}
      </div>
    </div>
  );
}
