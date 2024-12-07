import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoHeartCircle } from "react-icons/io5";
import { MainAppContext } from "@/context/MainContext";
import { AppContext } from "@/context/AppContext";
import { FaChevronDown } from 'react-icons/fa';

export default function Featured2({
  products,
  filteredCategory,
  wishlistedProducts,
}) {
  const [screenSize, setScreenSize] = useState("");
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [limit, setLimit] = useState(12); // Initially display 10 products

  const {
    handleAddToWishlist,
    handleRemoveWishlist,
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
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Filter and group products by subcategories
    const groupedProducts = {};
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
      ?.forEach((product) => {
        const subCategory = product.subCategory || "Others";
        if (!groupedProducts[subCategory]) {
          groupedProducts[subCategory] = [];
        }
        groupedProducts[subCategory].push(product);
      });

    // Flatten grouped products and limit their count evenly
    const limitedProducts = Object.values(groupedProducts)
      .flatMap((group) => group.slice(0, Math.ceil(limit / Object.keys(groupedProducts).length))) // Evenly pick products
      .slice(0, limit);

    setAllProducts(products);
    setVisibleProducts(limitedProducts);
  }, [products, filteredCategory, limit]);

  const handleViewMore = () => {
    setLimit(limit + 12); // Increment limit by 10
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 px-[2%] pb-20">
        {visibleProducts?.length > 0 ? (
          visibleProducts.map((pro, index) => (
            <div
              className="relative border-2 border-gray-300 hover:shadow-lg hover:border-gray-500 transition-all duration-300 rounded-lg"
              key={index}
            >
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
                  <p className="text-lg font-semibold text-gray-900 truncate">
                    {pro.title}
                  </p>
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
          <p className="text-center text-xs w-full sm:text-sm">
            No products available in this category
          </p>
        )}
      </div>

      {/* View More Button */}
      {allProducts.length > visibleProducts.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleViewMore}
            className="bg-gray-100 text-gray-800 border border-gray-300 px-6 py-2 rounded hover:bg-gray-200 transition-all duration-300 shadow-sm flex items-center transform hover:scale-105 active:scale-95 hover:shadow-lg active:shadow-inner"
          >
            View More
            <FaChevronDown className="ml-2" /> {/* Downward arrow icon */}
          </button>
        </div>
      )}
    </div>
  );
}