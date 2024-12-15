import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import {
  IoClose,
  IoCloseCircle,
  IoHeartCircle,
  IoStarOutline,
} from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { MainAppContext } from "@/context/MainContext";
import LoadSirv from "../LoadSirv";
import { Helmet } from "react-helmet";
import parse from "html-react-parser";
import AttributeSlider from "@/components/AttributeSlider";
import { Tooltip } from "@material-tailwind/react";
import { FaShare } from "react-icons/fa";
import { gsap } from 'gsap';

const ProductPage = ({ }) => {
  const [activeImage, SetActiveImage] = useState(1);
  const [viewMainImg, SetViewMainImg] = useState(false);
  const [materialImage, SetMaterialImage] = useState("");
  const [viewMaterialImg, SetViewMaterialImg] = useState(false);
  const [activeTab, SetActiveTab] = useState(1);
  const [isStock, SetIsStock] = useState(false);
  const {
    wishlistedProducts,
    handleAddToWishlist,
    handleRemoveWishlist,
    setCartCount,
    productPageId,
    setProductPageId,
    setBuyNow,
  } = useContext(MainAppContext);
  const [productQty, setProductQty] = useState(1);
  const [product, setProduct] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [sortedAttributes, setSortedAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [attributesArr, setAttributesArr] = useState({});
  // const [is360, setIs360] = useState(false);
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState(0);
  const [minprice, setMinPrice] = useState(0);
  const [maxprice, setMaxPrice] = useState(0);
  const [shouldDisableButton, setShouldDisableButton] = useState(true);
  const [display, setDisplay] = useState(false);
  // const [ARSupported, setARSupported] = useState(false);
  const [annotate, setAnnotate] = useState(false);
  const navigate = useNavigate();
  const { currency, cart, setCart, wishlist, setWishlist } =
    useContext(AppContext);
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  const param = useParams();
  // const productId = param.id;
  const model = useRef();
  // Accessing varient selections element
  const varient = useRef(null);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    console.log(selectedSize)
  }, [selectedSize]);
  // useEffect(() => {
  //   const userAgent = navigator.userAgent;
  //   console.log(userAgent);
  //   if (
  //     /iPhone|webOS|Android|iPad|iPod|BlackBerry|Windows Phone/i.test(userAgent)
  //   ) {
  //     console.log("AR Supported");
  //     setARSupported(true);
  //   } else {
  //     console.log("AR Not Supported");
  //   }
  // }, [ARSupported]);



  useEffect(() => {
    gsap.from('.fade-in', { duration: 1, opacity: 0, y: 50 });
  }, []);

  const getProductDetails = async (productId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product/${productPageId || productId
        }`
      );
      // if (response.data?.approved === false) {
      //   return navigate(-1);
      // }
      setProduct(response.data);
      setPrice(response.data?.price);
      SetActiveImage(response?.data?.mainImage);
      const sortedAttributes = response?.data?.attributes
        .filter((i) => {
          return i?.value !== "" && i?.type !== "";
        })
        .reduce((acc, curr) => {
          const index = acc.findIndex((item) => item.type === curr.type);
          if (index !== -1) {
            // If type already exists, push current object to its values array
            acc[index].values.push(curr);
          } else {
            // If type doesn't exist, create a new object with type and values array
            acc.push({ type: curr.type, values: [curr] });
          }
          return acc;
        }, []);

      let minPrice = Number.MAX_VALUE;
      let maxPrice = Number.MIN_VALUE;

      // Iterate over the outer array
      sortedAttributes.forEach((attribute) => {
        // Iterate over the inner array of values
        if (attribute.type?.toLowerCase() === "size") {
          attribute.values.forEach((value) => {
            const price = parseFloat(value.price); // Convert price to a number
            if (!isNaN(price)) {
              // Check if price is a valid number
              if (price < minPrice) {
                minPrice = price; // Update minPrice if necessary
              }
              if (price > maxPrice) {
                maxPrice = price; // Update maxPrice if necessary
              }
            }
          });
        }
      });
      if (minPrice == 0 || minPrice == Number.MAX_VALUE) {
        setMinPrice(response.data?.price);
      } else setMinPrice(minPrice);
      setMaxPrice(maxPrice);
      setSortedAttributes(sortedAttributes);
      // console.log(response.data.attributes);
      const organizedArrays = {};

      response.data.attributes.forEach((obj) => {
        const { type, value, price } = obj;
        if (!organizedArrays[type]) {
          organizedArrays[type] = [];
        }
        organizedArrays[type].push({ value, price });
      });

      setAttributesArr(organizedArrays);
      setSizes(response.data.sizes || []); // Assuming sizes are part of the product data
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    const productPageId2 = JSON.parse(sessionStorage.getItem("productPageId"));
    // console.log(productPageId2);
    setUserDetails(user);
    getProductDetails(productPageId2);
    getAllProducts();
    getReview(productPageId2);
    // if (userDetails) {
    //   getWishlist();
    // }
    // setWishlistedProducts(wishlist);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    const productPageId2 = JSON.parse(sessionStorage.getItem("productPageId"));
    // console.log(productPageId2);
    setUserDetails(user);
    getProductDetails(productPageId2);
    getAllProducts();
    getReview(productPageId2);
    // if (userDetails) {
    //   getWishlist();
    // }
    // setWishlistedProducts(wishlist);
  }, [param?.id]);
  useEffect(() => {
    if (typeof window.Sirv === "undefined") {
      LoadSirv().then(() => {
        window.Sirv.start();
      });
    } else {
      window.Sirv.start();
    }
  });
  useEffect(() => {
    function containsRequiredObjects(array) {
      let hasSize = false;
      let hasMaterial = false;
      let hasColor = false;

      for (const obj of array) {
        if (obj.type?.toLowerCase() === "size") {
          hasSize = true;
        } else if (obj.type?.toLowerCase() === "material") {
          hasMaterial = true;
        } else if (obj.type?.toLowerCase() === "color") {
          hasColor = true;
        }
        if (
          (hasSize && hasMaterial) ||
          (hasSize && hasColor) ||
          (hasMaterial && hasColor)
        ) {
          return true;
        }
      }

      return false;
    }
    const shouldDisableButton = !containsRequiredObjects(selectedAttribute);
    setShouldDisableButton(shouldDisableButton);
  }, [setSelectedAttributes, selectedAttribute]);

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
  const [products, setProducts] = useState([]);
  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product/all`
      );
      setProducts(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please Select a Size Before adding to Cart");
      return;
    }

    if (userLoggedIn) {
      // Existing logic for logged-in users
      addToCart(userDetails?._id, product?._id, productQty, selectedSize.size);
    } else {
      // New logic for non-logged-in users
      const tempCart = JSON.parse(localStorage.getItem("cart")) || [];

      // Check if product with same size already exists
      const existingProduct = tempCart.find(item =>
        item.productId._id === product._id &&
        item.size === selectedSize.size
      );

      if (existingProduct) {
        toast.error("Product already in cart with this size");
        return;
      }

      // Add new product to cart
      const cartItem = {
        productId: product,
        quantity: productQty,
        size: selectedSize.size,
        updatedPrice: minprice == 0 ? price : minprice
      };

      tempCart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(tempCart));
      setCartCount(tempCart.length);
      toast.success("Product Added to Cart");
    }
  };

  const addToCart = async (userId, productId, quantity, selectedSize) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/cart/addProduct`,
        {
          userId: userId,
          productId: productId,
          quantity: quantity,
          selectedSize: selectedSize,
          updatedPrice: minprice == 0 ? price : minprice,
        }
      );
      setCartCount((prev) => prev + 1);
      toast.success("Product Added to Cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      if (error.response && error.response.data.message === "Product already in cart with this size") {
        toast.error("Product already in cart with this size");
      } else if (error.response && error.response.data.message === "Size is Required") {
        toast.error("Please select a size");
      } else {
        toast.error("Failed to add product to cart");
      }
    }
  };

  const getReview = async (productPageId2) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/review/${productPageId2}`
      );
      // console.log(response.data.reviews);
      setReviews(response?.data?.reviews);
      const totalRatings = response?.data?.reviews?.reduce(
        (acc, review) => acc + review.rating,
        0
      );

      // Calculate the average rating
      const averageRating = Math.floor(
        totalRatings / response?.data?.reviews?.length
      );
      setRating(averageRating);
      // // console.log(averageRating);
      // Assuming the response contains an array of reviews
      return response.data.reviews; // Assuming the response contains an array of reviews
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return []; // Return an empty array in case of error
    }
  };

  const convertToText = (htmlContent) => {
    const textContent = htmlContent.replace(/<[^>]+>/g, "");

    return parse(textContent);
  };

  const handleShareClick = () => {
    // Implement share functionality
  };

  const handleWishlistClick = () => {
    if (wishlistedProducts.find((i) => i.productId?._id === product?._id)) {
      handleRemoveWishlist(product?._id);
    } else {
      handleAddToWishlist(product?._id);
    }
  };

  return (
    <section className="fade-in">
      <div data-aos="fade-right" data-aos-duration="1000">
        <Helmet>
          <title>{product?.title}</title>
          <meta name="description" content={product?.metaDescription} />
          <meta name="keywords" content={product?.metaHead} />
          <meta name="author" content={product?.metaTitle} />
        </Helmet>

        {/* <div className=" px-[4%] md:px-[8%] py-1 md:py-3 bg-[#F4F5F7] dark:bg-black dark:text-gray-400 dark:border-b dark:border-t dark:border-gray-600 flex items-center justify-between ">
          <div className=" flex items-center font-[500] text-[#858585] raleway text-[.8461538462rem] md:text-[.8461538462rem] ">
            <Link to="/">
              <span className="text-[#858585] cursor-pointer raleway">Home</span>
            </Link>
            <span className=" px-1 ">/</span>
            <span className="raleway">{product?.title}</span>
          </div>
          <div className="flex items-center ml-4">
            <FaShare
              className="cursor-pointer text-gray-600 text-xl mr-2"
              onClick={handleShareClick}
            />
            <button className="flex items-center" onClick={handleWishlistClick}>
              {wishlistedProducts.find((i) => i.productId?._id === product?._id) ? (
                <IoHeartCircle className="text-red-500 text-[25px]" />
              ) : (
                <IoHeartCircle className="text-gray-600 text-[25px]" />
              )}
            </button>
          </div>
        </div> */}

        <section className=" px-[3%] w-full mb-14 flex gap-10 mt-4 lg:mt-12 ">
          {loading || !product ? (
            <div className=" w-full flex items-center justify-center py-3">
              <img
                src="/Images/loader.svg"
                alt="loading..."
                className=" object-contain w-[60px] h-[60px]"
              />
            </div>
          ) : (
            <div className=" w-full  h-full">
              {viewMainImg && (
                <div className=" fixed w-full h-[100vh] flex items-center justify-center -top-0 z-50 left-0 bg-black/20">
                  <div className=" relative z-50 w-[70%] md:w-[50%] h-[60%]">
                    <IoClose
                      onClick={() => {
                        SetViewMainImg(false);
                      }}
                      className=" absolute text-[24px] -top-20 bg-orange-400 cursor-pointer right-0 z-50"
                    />
                    <img
                      src={activeImage}
                      alt={activeImage}
                      className=" w-full object-cover border border-white h-[80vh] absolute -top-20"
                    />
                  </div>
                </div>
              )}
              <div className=" bg-white dark:bg-white p-[2rem] border w-full flex flex-col md:grid grid-cols-9 gap-2 sm:gap-4 lg:gap-10 mb-3 lg:mb-10">
                <div className="flex relative flex-col items-start justify-start md:col-span-4 lg:col-span-3 gap-4">
                  <div className="w-full h-fit aspect-w-1 aspect-h-1">
                    <img
                      src={activeImage}
                      alt={activeImage}
                      onClick={() => {
                        SetViewMainImg(true);
                      }}
                      className="h-full w-full object-cover cursor-pointer border border-black"
                    />
                  </div>
                  <div className="raleway grid grid-cols-4 gap-1">
                    {/* Main image */}
                    <img
                      onClick={() => {
                        SetActiveImage(product?.mainImage);
                      }}
                      src={product?.mainImage}
                      alt={"mainImage"}
                      className={`${activeImage === product?.mainImage
                        ? "opacity-40 border-[2px] border-orange-400"
                        : "cursor-pointer"
                        } h-[70px] lg:h-[80px] w-fit md:w-full object-cover`}
                    />

                    {/* Additional images */}
                    {product?.additionalImages &&
                      product?.additionalImages.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          onClick={() => {
                            SetActiveImage(image);
                          }}
                          src={image}
                          alt={"product-pics"}
                          className={`${activeImage === image
                            ? "opacity-40 border-[2px] border-orange-400"
                            : "cursor-pointer"
                            } h-[70px] lg:h-[80px] w-fit md:w-full object-cover`}
                        />
                      ))}
                  </div>

                  <div className="w-full">
                    <div className=" grid grid-cols-1 lg:grid-cols-2 lg:gap-5">
                      {product.arFilePath && ARSupported && (
                        <model-viewer
                          key={product.id}
                          ref={model}
                          src={product.arFilePath}
                          ios-src={product.iOSSrc || ""}
                          alt="A 3D model"
                          ar
                          ar-modes="webxr scene-viewer quick-look"
                          camera-controls
                          auto-rotate
                        // style={modelViewerStyle}
                        >
                          <button
                            slot="ar-button"
                            className="raleway flex items-start justify-start gap-2 text-left text-[13px] py-2.5 mt-2 w-full"
                          >
                            <img
                              className="h-[23px] dark:invert object-contain"
                              src="/logos/space.svg"
                              alt="logo"
                            />
                          </button>
                        </model-viewer>
                      )}

                    </div>
                  </div>
                </div>

                <div className=" flex flex-col lg:w-[100%] col-span-4 xl:w-[100%] ">
                  <h4 className=" dark:text-gray-400 capitalize text-[30px] md:text-[30px] 2xl:text-[30px] font-[600] raleway text-[#1d1d1d] ">
                    {product?.title}
                  </h4>
                  <p className=" pt-[20px] text-[1.5rem] md:text-[1.7rem] 2xl:text-[1.9rem] font-semibold raleway text-[#1d1d1d]">
                    {product?.discountValue > 0 ? (
                      <>
                        <span className="text-gray-400 text-[1.4rem] line-through">
                          {currency} {product.price}
                        </span>
                        <span className="text-black text-[1.6rem] ml-2 font-[600]">
                          {currency} {product.discountValue}
                        </span>
                      </>
                    ) : (
                      <span className="text-black text-[1.6rem] font-[600]">
                        {currency} {product.price}
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] md:text-[12px] 2xl:text-[13px] -mt-2 raleway">
                    Tax Included
                  </p>

                  {/* Sizes and Stock Display */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product?.sizes?.map((size, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          // Handle size selection
                          setSelectedSize(size);
                        }}
                        className={`border p-2 rounded cursor-pointer ${size.stock > 0 ? "bg-gray-400" : "bg-gray-400 line-through"} ${selectedSize?.size === size.size ? "border-2 border-blue-500" : ""}`}
                      >
                        {size.size} {size.stock > 0 ? "" : "(Out of stock)"}
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  {product?.description && (
                    <div className="text-[12px] text-[#484848] md:text-sm flex items-center gap-2 border-t pt-[15px] mt-[15px] raleway">
                      {convertToText(product?.description)}
                    </div>
                  )}

                  {/* {console.log(selectedAttribute)} */}
                  {sortedAttributes.map((item, index) => (
                    <div key={index} className=" flex flex-col mt-2">
                      <p className=" mt-3 mb-2 capitalize text-[12.3px] md:text-[13.6px] 2xl:text-[15px] font-bold raleway text-[#484848] text-[1rem]">
                        {item?.type?.toLowerCase() === "size"
                          ? "Dimensions"
                          : "Finish"}
                      </p>
                      <div className=" flex overflow-hidden gap-2 raleway mb-3">
                        {item.values?.length > 6 ? (
                          <>
                            <AttributeSlider
                              data={item}
                              setPrice={setPrice}
                              setMaxPrice={setMaxPrice}
                              setMinPrice={setMinPrice}
                              SetActiveImage={SetActiveImage}
                              selectedAttribute={selectedAttribute}
                              setSelectedAttributes={setSelectedAttributes}
                              SetViewMaterialImg={SetViewMaterialImg}
                              SetMaterialImage={SetMaterialImage}
                            />
                          </>
                        ) : (
                          <>
                            {item?.values?.map((attr, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  if (
                                    attr.type !== "material" &&
                                    Number(attr?.price) !== 0
                                  ) {
                                    setMinPrice(Number(attr?.price));
                                    setMaxPrice(0);
                                  }
                                  const existingAttribute =
                                    selectedAttribute.find(
                                      (attribute) =>
                                        attribute.type === attr.type
                                    );

                                  if (existingAttribute) {
                                    const newArr = selectedAttribute.filter(
                                      (i) => {
                                        return i?.type !== attr?.type;
                                      }
                                    );
                                    setSelectedAttributes([...newArr, attr]);
                                    console.log([...newArr, attr]);
                                  } else {
                                    setSelectedAttributes([
                                      ...selectedAttribute,
                                      attr,
                                    ]);
                                  }
                                }}
                                className={` h-full ${selectedAttribute?.find(
                                  (i) => i.value === attr.value
                                )
                                  ? "bg-gray-300 text-gray-800"
                                  : ""
                                  }cursor-pointer w-fit border border-gray-300 text-gray-600 ${attr.type === "material" ? "" : "px-3 py-1"
                                  } text-sm ${attr?.type === "color"
                                    ? `bg-${attr.value} cursor-pointer `
                                    : ""
                                  } ${selectedAttribute?.find(
                                    (i) => i.value === attr.value
                                  ) && attr?.type === "color"
                                    ? " border-2 border-green-500 cursor-pointer"
                                    : ""
                                  } `}
                              >
                                {attr.type === "material" ? (
                                  <Tooltip
                                    className="z-20"
                                    content={attr?.value}
                                  >
                                    <img
                                      src={attr?.attributeImage}
                                      onClick={() => {
                                        SetMaterialImage(attr?.attributeImage);
                                        SetViewMaterialImg(true);
                                      }}
                                      alt="material-img"
                                      className={`w-[40px] h-[40px] md:w-[60px] md:h-[60px] object-cover border cursor-pointer  ${selectedAttribute?.find(
                                        (i) => i.value === attr?.value
                                      )
                                        ? " border-black"
                                        : ""
                                        }`}
                                    />
                                  </Tooltip>
                                ) : (
                                  <p>{attr.value}</p>
                                )}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 flex items-center gap-2 ">
                    <button
                      onClick={handleAddToCart}
                      className="raleway text-center bg-black text-white font-medium text-sm py-2.5 w-full"
                    >
                      Add to cart
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      if (!selectedSize) {
                        toast.error("Please select a size before proceeding");
                        return;
                      }

                      const buyNowProduct = {
                        productId: product,
                        quantity: productQty,
                        _id: product?._id,
                        updatedPrice: product.discountValue || product.price,
                        size: selectedSize.size // Include selected size
                      };

                      // Store in session storage as backup
                      sessionStorage.setItem('buyNowProduct', JSON.stringify(buyNowProduct));

                      setBuyNow([buyNowProduct]);
                      navigate("/checkout?param=buynow");
                    }}
                    className="raleway text-center border-[2px] border-gray-500 font-semibold text-sm py-2.5 mt-2 w-full"
                  >
                    Buy Now
                  </button>
                  <div className=" flex items-center justify-between mt-2">
                    <div className=" flex items-center gap-5">
                      <button className="flex items-center gap-2">
                        {/* {// console.log(wishlistedProducts)} */}
                        {wishlistedProducts.find((i) => {
                          return i.productId?._id === product?._id;
                        }) ? (
                          <div
                            className=" flex items-center"
                            onClick={() => {
                              handleRemoveWishlist(product?._id);
                              // toast.error("Product Removed from Wishlist");
                            }}
                          >
                            <IoHeartCircle
                              className={`  cursor-pointer hover:text-red-500 text-[25px] text-red-500`}
                            />
                            <span className="text-[12px] w-full md:text-[13.5px] 2xl:text-[14px] font-[500] plus-jakarta">
                              Remove from wishlist
                            </span>
                          </div>
                        ) : (
                          <div
                            className=" flex items-center"
                            onClick={() => {
                              handleAddToWishlist(product?._id);
                            }}
                          >
                            <IoHeartCircle
                              className={`  cursor-pointer hover:text-red-500 text-[25px] text-gray-600`}
                            />
                            <span className="raleway text-[12px] md:text-[13.5px] 2xl:text-[14px] font-[500]">
                              Add to wishlist
                            </span>
                          </div>
                        )}
                      </button>
                      {/* <button className="flex items-center gap-2">
                      <IoIosGitCompare />
                      <span className="text-[12px] md:text-[13.5px] 2xl:text-[14px] font-[500] plus-jakarta">
                        Compare
                      </span>
                    </button> */}
                    </div>
                    <div className=" flex items-center gap-4">
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: product.title,
                              url: window.location.href,
                            })
                              .then(() => console.log('Product shared successfully!'))
                              .catch((error) => console.error('Error sharing:', error));
                          } else {
                            alert('Sharing is not supported in this browser.');
                          }
                        }}
                        className="flex items-center"
                      >
                        <FaShare className="text-gray-600 text-[25px] cursor-pointer hover:text-red-500" />
                        <span className="text-[12px] md:text-[13.5px] 2xl:text-[14px] font-[500] ml-1">
                          Share
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* <div className="flex justify-between mt-3 pt-3 pb-3 border-t border-gray-300">
                    <p className="raleway text-[12px] md:text-[13.5px] 2xl:text-[14px] font-[500]">
                      <span>SKU:</span>{" "}
                      <span className="text-[#848484]">{product?.sku}</span>
                    </p>
                    <p className="raleway text-[12px] md:text-[13.5px] 2xl:text-[14px] font-[500]">
                      <span>Brand:</span>{" "}
                      <span className="text-[#848484]">
                        {product?.brand ? product?.brand : "Not Available"}
                      </span>
                    </p>
                  </div> */}
                  {/* Buttons here */}
                </div>
                <div className=" h-full  col-span-2 hidden lg:block ">
                  {/* <h4 className=" raleway text-[14px] font-[600] text-[#000] mb-3 ">
                    You might also like
                  </h4> */}
                  <div className=" w-full h-full flex flex-col gap-1 ">
                    {products
                      ?.filter((e) => {
                        return (
                          e.approved &&
                          e.mainCategory === product?.mainCategory &&
                          e.title !== product?.title
                        );
                      })
                      .slice(0, 3)
                      .map((item, index) => {
                        return (
                          <div key={index}>
                            {/* {item.type === "card" ? ( */}
                            <div key={index} className=" p-1 relative flex ">
                              {/* <div className=" absolute top-3 left-4 flex gap-2 ">
                                {item?.dis && (
                                  <div className="  px-2 py-0.5 text-xs bg-[#000] text-white ">
                                    SALE
                                  </div>
                                )}
                                {item?.tag && (
                                  <div className="  px-2 py-0.5 text-xs bg-red-700 text-white ">
                                    HOT
                                  </div>
                                )}
                              </div> */}

                              {/* <div>
                                {wishlistedProducts.find((i) => {
                                  return i?.productId?._id === item?._id;
                                }) ? (
                                  <IoHeartCircle
                                    onClick={() => {
                                      handleRemoveWishlist(item?._id);
                                    }}
                                    className={` absolute top-3 right-3 cursor-pointer hover:text-red-500 text-[25px] text-red-500`}
                                  />
                                ) : (
                                  <IoHeartCircle
                                    onClick={() => {
                                      handleAddToWishlist(item?._id);
                                    }}
                                    className={` absolute top-3 right-3 cursor-pointer hover:text-red-500 text-[25px] text-gray-600`}
                                  />
                                )}
                              </div> */}
                              <Link
                                to={`/product/${item?.title
                                  ?.replace(/\//g, "")
                                  .replace(/\s+/g, "-")}`}
                                onClick={() => {
                                  localStorage.setItem(
                                    "productPageId",
                                    item?._id
                                  );
                                  setProductPageId(item?._id);
                                }}
                                className=" flex gap-2 raleway"
                              >
                                <img
                                  className=" h-[60px] w-[60px] "
                                  src={item.mainImage}
                                  alt="product-img"
                                />
                                <div className=" flex flex-col">
                                  <p className="  text-xs font-[500] mt-2 mb-1 text-[#484848]">
                                    {item.title?.slice(0, 35)}
                                  </p>
                                  <div className=" flex ">
                                    {item?.discountValue > 0 &&
                                      item?.discountValue !== null ? (
                                      <>
                                        <p className="font-[600] text-xs mr-0.5 dark:text-gray-400 text-[#A4A4A4]">
                                          {currency}{" "}
                                          <span className="line-through">
                                            {currency === "OMR"
                                              ? (item.price * 0.1).toFixed(2)
                                              : item.price}
                                          </span>
                                        </p>
                                        <p className="font-[600] text-xs dark:text-gray-400 text-[#000]">
                                          <span>
                                            {currency === "OMR"
                                              ? (
                                                item.discountValue * 0.1
                                              ).toFixed(2)
                                              : item.discountValue.toFixed(2)}
                                          </span>
                                        </p>
                                      </>
                                    ) : (
                                      <p className=" text-xs">
                                        {currency}{" "}
                                        {currency === "OMR"
                                          ? (item.price * 0.1).toFixed(2)
                                          : item.price}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    {/* <div className=" flex-col flex items-start mt-2">
                      <h4 className=" raleway text-[14px] font-[600] text-[#000] mb-1 mt-3 pb-3">
                        Quick Links
                      </h4>
                      <ul className=" raleway px-1 list-disc listing_disc text-[13px] md:text-[13.5px] flex flex-col sm:gap-3">
                        <li>
                          <Link to={"/contact"}>Get an Instant Quote!</Link>
                        </li>
                        <li>
                          <Link to={"/materialsAndColors"}>Material and Colors</Link>
                        </li>
                      </ul>
                    </div> */}
                  </div>
                </div>
              </div>

              <div className=" flex flex-col ">
                <div className=" flex items-start justify-left border-b border-gray-400 ">
                  <p
                    onClick={() => {
                      SetActiveTab(1);
                    }}
                    className={`raleway cursor-pointer text-center text-[11px] md:text-[16px] 2xl:text-[20px] py-1.5 px-7 ${activeTab === 1 && "bg-white dark:text-black"
                      } `}
                  >
                    Details
                  </p>
                  <p
                    onClick={() => {
                      SetActiveTab(3);
                    }}
                    className={`raleway cursor-pointer text-center text-[11px] md:text-[16px] 2xl:text-[20px] py-1.5 px-7 ${activeTab === 3 && "bg-white dark:text-black"
                      } `}
                  >
                    Reviews ({reviews.length})
                  </p>
                </div>
              </div>
              {activeTab === 1 ? (
                <div className="bg-white flex flex-col text-xs sm:text-sm lg:p-7 py-3 lg:py-10 font-[400]">
                  <p className=" raleway text-[12px] md:text-[13.3px] 2xl:text-[14px]">
                    {product?.editorContent && parse(product?.editorContent)}
                  </p>
                </div>
              ) : (
                <div className="bg-white flex flex-col items-center justify-center text-xs sm:text-sm lg:p-7 py-3 lg:py-10 font-[400]">
                  {/* {// console.log(reviews)} */}
                  {reviews.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className=" flex flex-col md:flex-row items-center justify-between shadow-sm shadow-black/30 bg-yellow-200 dark:bg-white/20 rounded-md my-2 md:w-[60%] p-5 "
                      >
                        <div>
                          <p>
                            Comment:
                            <span className=" ml-1  font-semibold">
                              {item.title}
                            </span>
                          </p>
                          <p className=" flex items-center gap-1">
                            Rating:
                            <Stars stars={item?.rating} />({item?.rating})
                          </p>
                          <p>
                            Review:
                            <span className=" ml-1  font-semibold">
                              {item.comment}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p>
                            By:
                            <span className=" ml-1  font-semibold">
                              {item?.userId?.name}
                            </span>
                          </p>
                          <p>
                            Date:
                            <span className=" ml-1  font-semibold">
                              {item.createdAt.split("T")[0]}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className=" lg:hidden">
                <h4 className=" raleway text-[14px] font-[600] text-[#000] mb-1 ">
                  You might also like
                </h4>
                <div className=" w-full h-full grid-cols-2 sm:grid-cols-3 grid lg:grid-cols-4 gap-5 ">
                  {products
                    ?.filter((e) => {
                      e.approved &&
                        e.mainCategory === product?.mainCategory &&
                        e.title !== product?.title;
                    })
                    .slice(0, 3)
                    .map((item, index) => {
                      return (
                        <div key={index}>
                          {/* {item.type === "card" ? ( */}
                          <div key={index} className=" relative ">
                            <div className=" absolute top-3 left-4 flex gap-2 ">
                              {item?.dis && (
                                <div className="  px-2 py-0.5 text-xs bg-[#000] text-white ">
                                  SALE
                                </div>
                              )}
                              {item?.tag && (
                                <div className="  px-2 py-0.5 text-xs bg-red-700 text-white ">
                                  HOT
                                </div>
                              )}
                            </div>

                            <div>
                              {wishlistedProducts.find((i) => {
                                return i?.productId?._id === item?._id;
                              }) ? (
                                <IoHeartCircle
                                  onClick={() => {
                                    handleRemoveWishlist(item?._id);
                                  }}
                                  className={` absolute top-3 right-3 cursor-pointer hover:text-red-500 text-[25px] text-red-500`}
                                />
                              ) : (
                                <IoHeartCircle
                                  onClick={() => {
                                    handleAddToWishlist(item?._id);
                                  }}
                                  className={` absolute top-3 right-3 cursor-pointer hover:text-red-500 text-[25px] text-gray-600`}
                                />
                              )}
                            </div>
                            <Link
                              to={`/product/${item?.title
                                ?.replace(/\//g, "")
                                .replace(/\s+/g, "-")}`}
                              onClick={() => {
                                localStorage.setItem(
                                  "productPageId",
                                  item?._id
                                );
                                setProductPageId(item?._id);
                              }}
                            >
                              <img
                                className=" h-[200px] sm:h-[270px] lg:h-[300px] xl:h-[360px] "
                                src={item.mainImage}
                                alt="product-img"
                              />
                              <p className=" text-center text-sm sm:text-base  font-[500] mt-2 mb-1">
                                {item.title?.slice(0, 20)}
                              </p>
                              <div className=" flex items-center justify-center">
                                {item?.discountValue > 0 &&
                                  item?.discountValue !== null ? (
                                  <>
                                    <p className="font-[600] text-xs md:text-base mr-0.5 dark:text-gray-400 text-[#A4A4A4]">
                                      {currency}{" "}
                                      <span className="line-through">
                                        {currency === "OMR"
                                          ? (item.price * 0.1).toFixed(2)
                                          : item.price}
                                      </span>
                                    </p>
                                    <p className="font-[600] text-xs md:text-base dark:text-gray-400 text-[#000]">
                                      {currency}{" "}
                                      <span>
                                        {currency === "OMR"
                                          ? (item.discountValue * 0.1).toFixed(
                                            2
                                          )
                                          : item.discountValue.toFixed(2)}
                                      </span>
                                    </p>
                                  </>
                                ) : (
                                  <p className=" text-center text-sm sm:text-base">
                                    {currency}{" "}
                                    {currency === "OMR"
                                      ? (item.price * 0.1).toFixed(2)
                                      : item.price}
                                  </p>
                                )}
                              </div>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default ProductPage;