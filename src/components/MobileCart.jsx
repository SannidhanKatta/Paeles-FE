import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { RiCloseLine, RiDeleteBin6Line } from "react-icons/ri";
import { AppContext } from "../context/AppContext";
import { MainAppContext } from "@/context/MainContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function MobileCart({ userData }) {
  const { cartTotal, setCartTotal, isCartOpen, SetIsCartOpen, currency } =
    useContext(AppContext);
  const [cartProducts, setCartProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [couponName, setCouponName] = useState("");
  const [discountAmt, setDiscountAmt] = useState(0);
  const [userDetails, setUserDetails] = useState({});
  const [cart, setCart] = useState([]);
  const server_url = import.meta.env.VITE_SERVER_URL;
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  const [coupon, setCoupon] = useState("");
  const { isDarkMode, SetIsDarkMode, setCartCount } =
    useContext(MainAppContext);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    // // // console.log(user);
    setUserDetails(user);
    if (userLoggedIn == true) {
      getCart(user?._id || userData?._id);
    } else {
      var tempCart = JSON.parse(localStorage.getItem("cart")) || [];
      // // console.log(tempCart);
      setCartCount(tempCart?.length);
      setCart(tempCart || []);

      const total1 = tempCart?.reduce(
        (acc, obj) => acc + obj.updatedPrice * obj.quantity,
        0
      );
      setTotal(total1);
      setCartTotal(total1);
    }
  }, [userLoggedIn]);

  useEffect(() => {
    getCoupon();
  }, [cart]);

  const getCart = async (userId) => {
    if (userLoggedIn) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/cart/${userDetails?._id || userId || userData?._id
          }`
        );
        setCart(response.data.cart?.products);
        setCartCount(response.data.cart?.products?.length);
        if (response.data.cart?.products?.length > 0) {
          const total1 = response.data.cart?.products.reduce(
            (acc, obj) => acc + obj?.updatedPrice * obj?.quantity,
            0
          );
          setTotal(total1);
          if (response.data.cart.couponDiscountedTotal != 0) {
            setDiscountAmt(total1 - response.data.cart.couponDiscountedTotal);
          }
        }
        // // console.log(response.data.cart?.products);
        // Handle success response, if needed
      } catch (error) {
        console.error("Error Fetching Cart", error);
      }
    } else {
      return;
    }
  };
  const addToCart = async (userId, productId, quantity) => {
    // // console.log(quantity);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/cart/addProduct`,
        {
          userId: userId,
          productId: productId,
          quantity: quantity,
        }
      );
      // // console.log(response.data.cart);
      getCart(userId);
      toast.success("Product Added to Cart");
      // Handle success response, if needed
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart");
      // Handle error
    }
  };

  const decreaseQuantityOfProduct = async (userId, productId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/cart/decreaseQuantity`,
        {
          userId: userId,
          productId: productId,
        }
      );
      // // console.log(response.data.cart);
      getCart(userId);
      toast.success("Product quantity decreased");
    } catch (error) {
      console.error("Error decreasing product quantity:", error);
      toast.error("Failed to decrease product quantity");
    }
  };
  const increaseQuantityOfProduct = async (userId, productId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/cart/increaseQuantity`,
        {
          userId: userId,
          productId: productId,
        }
      );
      // // console.log(response.data.cart);
      getCart(userId);
      toast.success("Product quantity increased");
    } catch (error) {
      console.error("Error increasing product quantity:", error);
      toast.error("Failed to increase product quantity");
    }
  };

  const removeProduct = async (userId, productId) => {
    if (userLoggedIn) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/cart/removeProduct`,
          {
            userId: userId,
            productId: productId,
          }
        );
        getCart(userId);
        toast.success("Product Removed from Cart");
      } catch (error) {
        console.error("Error removing product from cart:", error);
        toast.error("Failed to remove product from cart");
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = localCart.filter(item => item.productId._id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      setCartCount(updatedCart.length);

      // Update total
      const newTotal = updatedCart.reduce(
        (acc, item) => acc + item.updatedPrice * item.quantity,
        0
      );
      setTotal(newTotal);
      toast.success("Product Removed from Cart");
    }
  };

  const applyCoupon = async () => {
    const userId = userDetails._id;

    try {
      // if (discountAmt !== 0) {
      //   return toast("Other Coupon Already Applied.");
      // }
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/cart/applyCoupon`,
        {
          userId: userId,
          couponCode: coupon,
          total,
        }
      );
      // // console.log(response.data);
      // setCoupon(response.data?.coupon);
      if (response.data?.coupon?.discountType === "percentage") {
        const total1 =
          parseFloat(
            cart?.reduce(
              (acc, obj) => acc + obj?.updatedPrice * obj.quantity,
              0
            ) * response.data?.coupon?.discountAmount
          ) / 100;
        const total2 = parseFloat(
          cart?.reduce(
            (acc, obj) => acc + obj?.updatedPrice * obj.quantity,
            0
          ) *
          (response.data?.coupon?.discountAmount * 0.01)
        );
        // // // console.log(total1);
        // setTotal(total1);
        // console.log("6");
        setDiscountAmt(total2);
      } else if (response.data?.coupon?.discountType === "fixed") {
        // const total1 =
        //   cart?.reduce(
        //     (acc, obj) => acc + obj?.updatedPrice * obj.quantity,
        //     0
        //   ) - response.data?.coupon?.discountAmount;
        // // // console.log(total1);
        // setTotal(total1);
        // console.log("7");
        setDiscountAmt(response.data?.coupon?.discountAmount);
      }
      toast.success(response.data.message);
      getCoupon();
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      toast.error(error.response.data.error);
    }
  };

  const removeCoupon = async () => {
    try {
      const userId = userDetails._id;
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/cart/removeCoupon/${userId}`
      );
      toast.success(response.data.message);
      setDiscountAmt(0);
      getCoupon();
    } catch (err) {
      console.log(err);
      toast.error("Error removing coupon");
    }
  };

  const getCoupon = async () => {
    try {
      const userId = userDetails._id;
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/cart/getCoupon/${userId}`
      );
      console.log(response.data.coupon);
      setCouponName(response.data.coupon.code);
    } catch (err) {
      setCouponName(null);
    }
  };

  const totalDiscount = cart.reduce((acc, item) => {
    if (item.productId?.discountValue) {
      const discountAmount = (item.updatedPrice - item.productId.discountValue) * item.quantity; // Calculate discount for this item
      return acc + discountAmount; // Sum up the total discount
    }
    return acc; // No discount for this item
  }, 0);

  return (
    <Transition.Root show={isCartOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`${isDarkMode ? "" : ""} relative dark z-50`}
        onClose={SetIsCartOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-800">
                          Cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <RiCloseLine
                            onClick={() => {
                              SetIsCartOpen(false);
                            }}
                            className=" text-[30px] text-[#FF7004] "
                          />
                        </div>
                      </div>
                      {cart?.length > 0 ? (
                        <div className="mt-8">
                          <div className="flow-root">
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-300"
                            >
                              {cart?.map((item, index) => {
                                const discountedPrice = item.productId?.discountValue
                                  ? item.productId.discountValue
                                  : null;

                                return (
                                  <div
                                    key={index}
                                    className="relative w-[100%] grid grid-cols-5 gap-2 p-1 border-gray-500 dark:text-gray-800"
                                  >
                                    {/* Product Image Link */}
                                    <Link
                                      to={`/product/${item.productId?.title?.replace(/\//g, "").replace(/\s+/g, "-")}?productId=${item.productId?._id}`}
                                      onClick={() => {
                                        setProductPageId(item?.productId?._id);
                                      }}
                                      className="col-span-1"
                                    >
                                      <img
                                        className="h-[75px] md:h-[120px] 2xl:w-[150px] object-cover"
                                        src={item.productId.mainImage}
                                        alt="product-img"
                                      />
                                    </Link>

                                    <div className="col-span-3 flex flex-col text-[12.3px]">
                                      {/* Product Title Link */}
                                      <Link
                                        to={`/product/${item.productId?.title?.replace(/\//g, "").replace(/\s+/g, "-")}?productId=${item.productId?._id}`}
                                        onClick={() => {
                                          setProductPageId(item?.productId?._id);
                                          sessionStorage.setItem("productPageId", JSON.stringify(item?.productId?._id));
                                        }}
                                      >
                                        <p className="font-semibold">{item.productId?.title?.slice(0, 50)}</p>
                                      </Link>

                                      {/* Price and Discount */}
                                      {discountedPrice !== null ? (
                                        <>
                                          <p className="font-bold text-gray-500 line-through">
                                            {currency} {currency === "OMR" ? (item.updatedPrice * 0.1).toFixed(2) : item.updatedPrice}
                                          </p>
                                          <p className="font-bold">
                                            {currency} {currency === "OMR" ? (discountedPrice * 0.1).toFixed(2) : discountedPrice}
                                          </p>
                                        </>
                                      ) : (
                                        <p className="font-bold">
                                          {currency} {currency === "OMR" ? (item.updatedPrice * 0.1).toFixed(2) : item.updatedPrice}
                                        </p>
                                      )}

                                      {/* Quantity Adjustment */}
                                      <div className="flex items-center">
                                        Qty:
                                        <div className="flex items-center justify-center">
                                          <span
                                            onClick={() => {
                                              if (userLoggedIn) {
                                                decreaseQuantityOfProduct(userDetails._id, item?.productId?._id);
                                              } else {
                                                toast("You are not Logged In");
                                              }
                                            }}
                                            className="px-3 text-[17px] cursor-pointer dark:hover:text-black hover:bg-gray-400"
                                          >
                                            -
                                          </span>
                                          <input
                                            className="ml-1 w-[20px] dark:bg-transparent"
                                            type="number"
                                            autoFocus={false}
                                            disabled
                                            value={item.quantity}
                                          />
                                          <span
                                            onClick={() => {
                                              if (userLoggedIn) {
                                                addToCart(userDetails._id, item.productId._id, 1);
                                              } else {
                                                toast("You are not Logged In");
                                              }
                                            }}
                                            className="px-3 text-[17px] cursor-pointer dark:hover:text-black hover:bg-gray-400"
                                          >
                                            +
                                          </span>
                                        </div>
                                      </div>

                                      {/* Remove Item */}
                                      <RiDeleteBin6Line
                                        onClick={() => {
                                          if (userLoggedIn) {
                                            removeProduct(userDetails._id, item?.productId?._id);
                                          } else {
                                            const tempCart = JSON.parse(localStorage.getItem("cart")) || [];
                                            const newTempCart = tempCart?.filter(
                                              (i) => i?.productId?._id !== item?.productId?._id
                                            );
                                            setCartCount(newTempCart?.length);
                                            const total1 = newTempCart?.reduce(
                                              (acc, obj) => acc + obj.productId?.price * obj.quantity,
                                              0
                                            );
                                            setTotal(total1);
                                            setCart(newTempCart);
                                            localStorage.setItem("cart", JSON.stringify(newTempCart));
                                            return toast.success("Product removed from Cart");
                                          }
                                        }}
                                        className="absolute right-2 text-[20px] text-red-500 hover:text-red-600 transition-colors duration-200"
                                      />
                                    </div>
                                  </div>
                                );
                              })}

                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col w-full items-center justify-center py-10">
                          <p className="text-sm font-semibold text-gray-600">
                            No Items in Cart
                          </p>
                          <Link
                            to="/shop/all/all"
                            onClick={() => {
                              SetIsCartOpen(false);
                            }}
                            className="underline text-orange-600"
                          >
                            Contine Shopping
                          </Link>
                        </div>
                      )}
                    </div>
                    {cart?.length !== 0 && (
                      <div className="border-t border-gray-400 px-4 py-2 sm:px-6">
                        <div className="flex flex-col">
                          <div className="mt-1 relative">
                            <input
                              type="text"
                              className="dark:bg-transparent outline-none w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] p-2 py-2.5 text-[#7A7A7A] text-[11px] md:text-[14px] mb-1"
                              placeholder="Coupon Code"
                              value={!coupon ? "" : coupon}
                              onChange={(e) => {
                                setCoupon(e.target.value);
                              }}
                            />
                            <button
                              className="bg-[#363F4D] absolute top-0 right-0 px-2 py-3 font-medium uppercase text-[10px] md:text-[13px] text-white"
                              onClick={() => {
                                if (userLoggedIn == true) {
                                  applyCoupon();
                                } else {
                                  toast("You are not logged in");
                                }
                              }}
                            >
                              Apply Code
                            </button>
                            {couponName && (
                              <div className="mt-3 flex items-center bg-gray-100 rounded p-2">
                                <span className="text-gray-700 text-sm md:text-base">
                                  {couponName}
                                </span>
                                <button
                                  className="ml-2 text-red-600 font-bold text-lg focus:outline-none hover:text-red-800 transition-colors"
                                  onClick={removeCoupon}
                                >
                                  &times;
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col p-2 justify-center bg-white dark:bg-white/5 dark:text-gray-800">
                          <div className="flex items-center justify-between font-[600] plus-jakarta tetx-[#363F4D] text-[13.4px] 2xl text-[13px]:md:text-[14px]">
                            <p>Sub Total</p>
                            <p>
                              {currency} {currency === "OMR" ? (total * 0.1).toFixed(2) : total}
                            </p>
                          </div>
                          {totalDiscount > 0 && (
                            <div className="flex items-center justify-between font-[600] plus-jakarta tetx-[#363F4D] text-[13.4px] 2xl text-[13px]:md:text-[14px]">
                              <p>Discount</p>
                              <p>
                                {currency} {currency === "OMR" ? (totalDiscount * 0.1).toFixed(2) : totalDiscount}
                              </p>
                            </div>
                          )}
                          <div className="mt-3 py-1 border-t-[1px] border-[#999999] flex items-center justify-between font-[700] plus-jakarta text-[13px] md:text-[16px] 2xl:text-[18px]">
                            <p>Grand Total</p>
                            <p>
                              {currency} {currency === "OMR" ? ((total - totalDiscount) * 0.1).toFixed(2) : (total - totalDiscount)}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (userLoggedIn == true) {
                              SetIsCartOpen(false);
                              return navigate("/checkout");
                            }
                            else {
                              SetIsCartOpen(false);
                              toast.success("Please Login to continue...");
                              return navigate("/login");
                            }
                          }}
                          className="w-full bg-[#363F4D]  border-[1.4px] border-[#363F4D] px-4 py-2.5 font-medium uppercase text-[11.2px] md:text-[13px] text-white"
                        >
                          Checkout
                        </button>

                        <p className="text-[#474747] dark:text-gray-600 text-[10px] mt-2">
                          Free Shipping on All Orders Over {currency}1000!
                        </p>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
