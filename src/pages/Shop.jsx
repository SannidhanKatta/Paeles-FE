import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MdStar } from "react-icons/md";
import MultiRangeSlider from "multi-range-slider-react";
import { AppContext } from "../context/AppContext";
import { IoHeartCircle, IoStarOutline } from "react-icons/io5";
import { array, number } from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { MainAppContext } from "@/context/MainContext";
import { FaStar } from "react-icons/fa";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Dialog } from '@headlessui/react';
import { gsap } from 'gsap';
// import './index.css';

const sortMethods = [
  {
    id: 1,
    name: "Sort By Popularity",
    parameter: "rating",
  },
  {
    id: 2,
    name: "Price(Low to High)",
    parameter: "price",
  },
  {
    id: 3,
    name: "Price(High to Low)",
    parameter: "price",
  },
  {
    id: 4,
    name: "A to Z",
    parameter: "name",
  },
  {
    id: 5,
    name: "Z to A",
    parameter: "name",
  },
];

const Shop = () => {
  const {
    filterCategories,
    setFilterCategories,
    filterSubCategories,
    setFilterSubCategories,
    filterColor,
    setFilterColor,
  } = useContext(AppContext);

  const {
    wishlistedProducts,
    setWishlistedProducts,
    handleAddToWishlist,
    setCartCount,
    minValue,
    set_minValue,
    maxValue,
    set_maxValue,
    maxPrice,
    setMaxPrice,
    Products,
    handleRemoveWishlist,
    buyNow,
    setBuyNow,
    setProductPageId,
  } = useContext(MainAppContext);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState(1);
  const [banners, setBanners] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);
  // const [Products, setProducts] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  const [itemsPerPage, setItemsPerPage] = useState(12);
  const { category, subcategory } = useParams();
  const [openCategory, setOpenCategory] = useState(null);

  const { SetIsMobileFilterOpen, currency, wishlist } = useContext(AppContext);
  const handleInput = (e) => {
    set_minValue(Number(e.minValue));
    set_maxValue(Number(e.maxValue));
  };
  const [categories, setCategories] = useState([]);
  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/category`
      );
      // console.log(response.data.categories);
      setCategories(response.data?.categories);
      // // // console.log(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/products`);
      const products = response.data.products;

      // Apply filters immediately after fetching
      const filteredProducts = filterProducts(products);
      const sortedProducts = sortProducts(sortMethod, filteredProducts);

      setSortedArray(sortedProducts);
      setProducts(products);
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getAllCategories(),
          getAllBanners(),
          getAllProducts()
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchInitialData();

    const user = JSON.parse(localStorage.getItem("user"));
    setUserDetails(user);
    setWishlistedProducts(wishlist);
  }, []);

  // Separate useEffect for category/subcategory changes
  useEffect(() => {
    if (category || subcategory) {
      setLoading(true);
      setFilterCategories(category ? category.toLowerCase() : "all");
      setFilterSubCategories(subcategory ? subcategory.toLowerCase() : "all");
      getAllProducts().then(() => {
        setLoading(false);
      });
    }
  }, [category, subcategory]);

  useEffect(() => {
    if (category) {
      const normalizedCategory = category.toLowerCase();
      setOpenCategory(normalizedCategory);
      setSelectedCategory(normalizedCategory);
    } else {
      setOpenCategory(null);
      setSelectedCategory(null);
    }
  }, [category]);

  const filterProducts = (products) => {
    if (!products) return [];

    return products.filter((product) => {
      // Check if product matches category filter
      const matchesCategory =
        filterCategories === "all" ||
        product?.mainCategory?.some(
          (cat) => cat.toLowerCase() === filterCategories.toLowerCase()
        );

      // Check if product matches subcategory filter
      const matchesSubcategory =
        filterSubCategories === "all" ||
        product?.subCategory?.some(
          (sub) => sub.toLowerCase() === filterSubCategories.toLowerCase()
        );

      return matchesCategory && matchesSubcategory && product?.approved;
    });
  };

  // Update the useEffect for sorting to include filtering
  useEffect(() => {
    const filteredProducts = filterProducts(Products);
    const sortedProducts = sortProducts(sortMethod, filteredProducts);
    setSortedArray(sortedProducts);
  }, [Products, sortMethod, filterCategories, filterSubCategories]);

  // Update the sortProducts function to accept the products array
  const sortProducts = (method, productsToSort) => {
    const products = productsToSort || Products;
    switch (method) {
      case "2":
        return [...products].sort((a, b) => a.price - b.price);
      case "3":
        return [...products].sort((a, b) => b.price - a.price);
      case "4":
        return [...products].sort((a, b) => a.title.localeCompare(b.title));
      case "5":
        return [...products].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return [...products].sort(
          (a, b) => Number(b.avgRating) - Number(a.avgRating)
        );
    }
  };

  const Stars = ({ stars }) => {
    const ratingStars = Array.from({ length: 5 }, (elem, index) => {
      return (
        <div key={index}>
          {stars >= index + 1 ? (
            <FaStar className=" dark:text-yellow-400 text-black" />
          ) : (
            <IoStarOutline className=" text-black dark:text-yellow-400 " />
          )}
        </div>
      );
    });
    return <div className=" flex items-center gap-0.5">{ratingStars}</div>;
  };

  const getAllBanners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/banner`
      );
      setBanners(response.data?.banners);
      // // // // console.log(response.data.banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    gsap.from('.fade-in', { duration: 1, opacity: 0, y: 50 });
  }, []);

  return (
    <section>
      <div className="fade-in">
        <div data-aos="fade-up" data-aos-duration="1000">
          <div className=" ">
            <div className=" px-[4%] md:px-[8%] py-3.5 md:py-7 bg-[#F4F5F7] dark:bg-black dark:text-gray-400 dark:border-b dark:border-t dark:border-gray-600  flex items-center justify-between ">
              <h4 className=" uppercase text-[15px]  md:text-[18px] font-[500] plus-jakarta text-[#212121] dark:text-gray-400 ">
                {filterCategories !== "all"
                  ? `${filterCategories}${filterSubCategories !== "all" ? ` / ${filterSubCategories}` : ''}`
                  : "Shop"}
                {/* {filterCategories !== "all" ? filterCategories : "Shop"} */}
              </h4>
              {/* <div className="flex items-center font-[500] plus-jakarta text-[12px] md:text-[13.6px]">
                {filterSubCategories !== "all" ? (
                  <span className="uppercase">{filterSubCategories}</span>
                ) : (
                  filterCategories !== "all" && (
                    <span className="uppercase">{filterCategories}</span>
                  )
                )}
              </div> */}
            </div>
            {loading ? (
              <div className=" w-full flex items-center justify-center py-3">
                <img
                  src="/Images/loader.svg"
                  alt="loading..."
                  className=" object-contain w-[60px] h-[60px]"
                />
              </div>
            ) : (
              <section className=" px-[3%] w-full mb-14 flex gap-10 mt-4 lg:mt-12 ">
                <div className=" hidden lg:block w-[23%] h-full border-[2px] p-2.5 border-[#E5E5E5] dark:border-gray-700 ">
                  <p className="  border-b-[1px] py-2.5 border-[#E5E5E5]  dark:text-gray-400 text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[14.5px] 2xl:text-[16px] ">
                    CATEGORIES
                  </p>

                  {categories?.map((cat, index) => (
                    <div key={index}>
                      <div
                        onClick={() => {
                          if (openCategory !== cat.fileName.toLowerCase()) {
                            setOpenCategory(cat.fileName.toLowerCase());
                          }
                        }}
                        className={`flex justify-between items-center py-2 cursor-pointer ${cat.fileName.toLowerCase() === filterCategories.toLowerCase()
                          ? 'text-[#F9BA48] font-semibold'
                          : 'text-gray-800'
                          }`}
                      >
                        <span>{cat.fileName}</span>
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <ChevronDownIcon
                            className={`w-4 h-4 transition-transform ${openCategory === cat.fileName.toLowerCase() ? 'rotate-180' : ''
                              }`}
                          />
                        )}
                      </div>
                      {openCategory === cat.fileName.toLowerCase() && cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pl-4">
                          {cat.subcategories.map((sub, subIndex) => (
                            <Link
                              key={subIndex}
                              to={`/shop/${cat.fileName}/${sub.name}`}
                              className={`block py-1 text-gray-600 hover:text-blue-400 ${filterSubCategories === sub.name.toLowerCase()
                                ? 'font-bold text-blue-500'
                                : ''
                                }`}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* <div className=" bg-[#E5E5E5] p-3 ">
                      <p className="  border-b-[1px] pt-2.5 border-[#E5E5E5] text-[#363F4D] font-[700] plus-jakarta text-[13px] md:text-[14.5px] 2xl:text-[16px] ">
                        FILTER BY PRICE
                      </p>
                      <MultiRangeSlider
                        min={0}
                        max={maxPrice}
                        step={5}
                        label="false"
                        ruler="false"
                        style={{ border: "none", outline: "none", boxShadow: "none" }}
                        barInnerColor="#F9BA48"
                        barRightColor="#000"
                        barLeftColor="#000"
                        thumbLeftColor="#F9BA48"
                        thumbRightColor="#F9BA48"
                        minValue={minValue}
                        maxValue={maxValue}
                        onInput={(e) => {
                          handleInput(e);
                        }}
                      />
                      <p className="  border-b-[1px] border-[#E5E5E5] text-[#363F4D] font-[700] plus-jakarta text-[12.5px] md:text-[14px] 2xl:text-[15px] ">
                        Price: {currency}{" "}
                        {currency === "OMR" ? minValue * 0.1 : minValue} - {currency}{" "}
                        {currency === "OMR" ? maxValue * 0.1 : maxValue}
                      </p>
                    </div> */}

                  {/* <button
                      onClick={() => {
                        setFilterColor("");
                        setFilterCategories("");
                        set_minValue(0);
                        set_maxValue(maxPrice);
                      }}
                      className=" my-2 bg-gray-600 text-white text-sm px-4 py-2 "
                    >
                      {" "}
                      Clear Filters
                    </button> */}
                </div>
                <div className="w-full lg:w-[77%] h-full">
                  <div className="w-full flex lg:grid grid-cols-3 gap-2 items-center justify-between">
                    <div className="flex items-center pr-3 py-2.5 text-[#7A7A7A] font-[400] text-[12px] md:text-[13.5px] 2xl:text-[14px]">
                      <label htmlFor="sort-method">Sort By: </label>
                      <select
                        name="sort-method"
                        id="sort-method"
                        className="text-[14px] p-1 dark:bg-transparent dark:border dark:border-gray-700"
                        value={sortMethod}
                        onChange={(e) => {
                          setSortMethod(e.target.value);
                        }}
                      >
                        {sortMethods.map((e, index) => {
                          return (
                            <option
                              className="p-2 dark:bg-black"
                              key={index}
                              value={e.id}
                            >
                              {e.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <p
                      onClick={() => {
                        setIsMobileFilterOpen(true);
                      }}
                      className="lg:hidden underline text-sm cursor-pointer"
                    >
                      Filters
                    </p>
                  </div>
                  {loading ? (
                    <div className=" w-full flex items-center justify-center py-3">
                      <img
                        src="/Images/loader.svg"
                        alt="loading..."
                        className=" object-contain w-[60px] h-[60px]"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sortedArray.map((product, index) => (
                          <div key={product._id || index} className="border p-4 rounded">
                            <Link
                              to={`/product/${product?.title?.replace(/\//g, "").replace(/\s+/g, "-")}?productId=${product?._id}`}
                              onClick={() => {
                                setProductPageId(product?._id);
                              }}
                            >
                              <div className="relative">
                                <img
                                  src={product.mainImage}
                                  alt={product.title}
                                  className="w-full aspect-square object-contain"
                                />
                                {/* Add wishlist icon */}
                                <div className="absolute top-2 right-2">
                                  {wishlistedProducts.find((i) => i?.productId?._id === product?._id) ? (
                                    <IoHeartCircle
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleRemoveWishlist(product?._id);
                                      }}
                                      className="cursor-pointer text-[25px] text-red-500"
                                    />
                                  ) : (
                                    <IoHeartCircle
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToWishlist(product?._id);
                                      }}
                                      className="cursor-pointer text-[25px] text-gray-600"
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="mt-2">
                                <h3 className="text-lg font-semibold">{product.title}</h3>
                                <p className="text-gray-600">
                                  {product.discountValue > 0 ? (
                                    <>
                                      <span className="line-through">
                                        {currency} {product.price}
                                      </span>
                                      <span className="text-black">
                                        {currency} {product.discountValue}
                                      </span>
                                    </>
                                  ) : (
                                    <span>
                                      {currency} {product.price}
                                    </span>
                                  )}
                                </p>
                                {/* Add rating stars */}
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < (product.avgRating || 0) ? "text-yellow-800" : "text-gray-300"}>
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                      {sortedArray?.filter((e) => {
                        const matchesCategory =
                          filterCategories === "all" ||
                          e?.mainCategory?.some(
                            (cat) => cat.toLowerCase() === filterCategories.toLowerCase()
                          );

                        return (
                          e?.approved &&
                          matchesCategory
                        );
                      })?.length > itemsPerPage ? (
                        // ... rest of the code
                        <div
                          onClick={() => setItemsPerPage((prev) => prev + 8)}
                          className="p-3 cursor-pointer border-t bg-gray-200 text-gray-700 font-semibold border-b border-gray-300 my-2 flex items-center justify-center gap-3"
                        >
                          See More
                        </div>
                      ) : (
                        <p className="mt-10 text-center">
                          No More Products Available
                        </p>
                      )}
                    </>
                  )}
                </div>
              </section>
            )}
          </div>

          <Dialog open={isMobileFilterOpen} onClose={() => setIsMobileFilterOpen(false)}>
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className={`fixed inset-y-0 right-0 flex items-center justify-center p-4 transition-transform transform ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <Dialog.Panel className="bg-white rounded-lg p-6 w-80">
                <h2 className="text-lg font-bold mb-4">Categories</h2>
                {categories?.map((category, index) => (
                  <div key={index}>
                    <div
                      onClick={() => {
                        setSelectedCategory(selectedCategory === category.fileName ? null : category.fileName);
                      }}
                      className={`flex justify-between items-center py-2 cursor-pointer ${category.fileName.toLowerCase() === filterCategories.toLowerCase()
                        ? 'text-[#e6ce6e]'
                        : 'text-gray-800'
                        }`}
                    >
                      <span>{category.fileName}</span>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${selectedCategory === category.fileName ? 'rotate-180' : ''
                          }`} />
                      )}
                    </div>
                    {selectedCategory === category.fileName && category.subcategories && category.subcategories.length > 0 && (
                      <div className="pl-4">
                        {category.subcategories.map((sub, subIndex) => (
                          <Link
                            key={subIndex}
                            to={`/shop/${category.fileName}/${sub.name}`}
                            onClick={() => {
                              setFilterSubCategories(sub.name.toLowerCase());
                              setIsMobileFilterOpen(false);
                            }}
                            className={`block py-1 text-gray-600 hover:text-blue-400 ${filterSubCategories === sub.name.toLowerCase()
                              ? 'font-bold text-blue-500'
                              : ''
                              }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Shop;
