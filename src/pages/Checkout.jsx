import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { MainAppContext } from "@/context/MainContext";
import { phoneCode } from "@/utilities/Currency";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import CryptoJS from "crypto-js";

const Checkout = () => {
  const navigate = useNavigate();
  const { currency, cartTotal, orders, setOrders } = useContext(AppContext);
  const { buyNow, setBuyNow } = useContext(MainAppContext);
  const [isTnCAccepted, setIsTnCAccepted] = useState(false);
  const [phoneCode1, setPhoneCode1] = useState("+91");
  const [paymentMode, setPaymentMode] = useState("");
  const [cart, setCart] = useState([]);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const {
    firstName,
    lastName,
    email,
    phone,
    addressLine1,
    addressLine2,
    country,
    city,
    state,
    zipCode,
  } = userDetails;
  const onChange = (e) =>
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [discountAmt, setDiscountAmt] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [isVerify, setIsVerify] = useState(false);
  const [VerCode, setVerCode] = useState();
  const [loading, setLoading] = useState(false);
  const [hideVerifyButton, setHideVerifyButton] = useState(false);
  const [discount, setDiscount] = useState(0);
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   // console.log(cartTotal);
  //   const total1 = cart.reduce((acc, obj) => acc + obj.price * 1, 0);
  //   setTotal(total1);
  // }, []);

  const customerId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))?._id
    : null;

  // // console.log(cart);

  const handlePhonePeCheckout = async () => {
    setLoading(true);

    const userDetailsUpdated = {
      ...userDetails,
      customerId: customerId,
      phone: phone,
    };

    // Format the products array correctly based on the flow
    let productsToSend;
    if (param?.toLowerCase() === "buynow") {
      // For buy now flow
      productsToSend = buyNow.map(item => {
        console.log("Buy now item:", item); // Debug log
        return {
          productId: item.productId._id,
          quantity: item.quantity || 1,
          price: item.productId.discountValue || item.productId.price,
          selectedSize: item.selectedSize // Keep the original selectedSize
        };
      });
    } else {
      // For cart flow
      productsToSend = cart.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.discountValue || item.updatedPrice,
        selectedSize: item.selectedSize
      }));
    }

    // Calculate final amount after all discounts
    const finalAmount = total;

    // Debug logs
    console.log("Products to send:", productsToSend);
    console.log("User details:", userDetailsUpdated);
    console.log("Final amount:", finalAmount);

    const coupon = sessionStorage.getItem("coupon");
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/order/phonepe-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: productsToSend,
          customer: userDetailsUpdated,
          totalAmount: finalAmount,
          coupon: coupon ? coupon : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.message || "Failed to initiate payment");
      }

      const result = await response.json();
      console.log("Payment response:", result);

      if (result.success && result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(result.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Error in PhonePe Checkout:", error);
      toast.error(error.message || "Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleIPGCheckout = (
    userDetails,
    customerId,
    phoneCode1,
    phone,
    total
  ) => {
    console.log(userDetails, customerId, phoneCode1, phone, total, cart);
    const userDetailsUpdated = {
      ...userDetails,
      customerId: customerId,
      phone: phoneCode1 + phone,
      total: total,
    };

    const searchParams = new URLSearchParams(userDetailsUpdated).toString();

    navigate(`/checkoutipg?${searchParams}`);
  };

  const sendOtp = async () => {
    try {
      console.log(userDetails);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/order/sendOtp`,
        { email: userDetails.email }
      );
      console.log(response.data);
      toast.success(response.data);
      setIsVerify(true);
      setHideVerifyButton(true);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/order/verifyOtp`,
        { email: userDetails.email, otp: VerCode }
      );
      console.log(response.data);
      toast.success(response.data);
      setIsVerify(false);
    } catch (error) {
      console.error("Error:", error.message);
      toast.success("Please try again");
    }
  };

  const searchParam = useLocation();
  const param = new URLSearchParams(searchParam?.search).get("param");
  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    setUserDetails(user);

    // If it's buy now flow
    if (param?.toLowerCase() === "buynow") {
      // First try to get from context
      if (buyNow?.length > 0) {
        const total1 = buyNow.reduce((acc, item) => {
          const price = item.productId?.discountValue
            ? item.productId.discountValue
            : (item.productId?.price || item.updatedPrice);
          return acc + (Number(price) * Number(item.quantity || 1));
        }, 0);
        setSubTotal(total1);
        setTotal(total1);
        setCart(buyNow);
      } else {
        // Fallback to session storage if context is empty
        const savedBuyNowProduct = JSON.parse(sessionStorage.getItem('buyNowProduct'));
        if (savedBuyNowProduct) {
          const price = savedBuyNowProduct.productId?.discountValue
            ? savedBuyNowProduct.productId.discountValue
            : (savedBuyNowProduct.productId?.price || savedBuyNowProduct.updatedPrice);
          const total1 = Number(price) * Number(savedBuyNowProduct.quantity || 1);
          setSubTotal(total1);
          setTotal(total1);
          setCart([savedBuyNowProduct]);
        } else {
          // If no product data found, navigate back
          navigate(-1);
        }
      }
    } else {
      // Regular cart flow
      getCart(user?._id);
    }
  }, [param, buyNow]);

  const getCart = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/cart/${userId}`
      );
      const cartData = response.data.cart;
      let totalAmount = 0;
      let totalDiscountAmount = 0;

      // Calculate product totals and discounts
      cartData.products.forEach((item) => {
        const originalPrice = item.updatedPrice;
        const discountedPrice = item.productId.discountValue || originalPrice;
        const quantity = item.quantity;

        // Calculate total based on discounted price
        totalAmount += discountedPrice * quantity;

        // Calculate product discount if exists
        if (item.productId.discountValue) {
          totalDiscountAmount += (originalPrice - discountedPrice) * quantity;
        }
      });

      // Set initial values
      setSubTotal(totalAmount + totalDiscountAmount); // Original total before any discounts
      setTotalDiscount(totalDiscountAmount); // Product discount amount
      setTotal(totalAmount); // Amount after product discount

      // Handle coupon discount if exists
      if (cartData.couponDiscountedTotal && cartData.couponDiscountedTotal < totalAmount) {
        const couponDiscountAmount = totalAmount - cartData.couponDiscountedTotal;
        setDiscountAmt(couponDiscountAmount);
        setTotal(cartData.couponDiscountedTotal); // Update total to include coupon discount
      } else {
        setDiscountAmt(0);
      }

      setCoupon(cartData.couponId);
      setCart(cartData.products);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Add this check for user login status
  const isUserLoggedIn = localStorage.getItem("user") ? true : false;

  // Validation function to check if all required fields are filled
  const isFormValid = () => {
    // Check if phone number is exactly 10 digits
    const phoneNumberValid = phone && phone.toString().length === 10;

    return (
      firstName &&
      lastName &&
      email &&
      phoneNumberValid &&
      addressLine1 &&
      country &&
      city &&
      state &&
      zipCode
    );
  };

  return (
    <div className=" w-full">
      <div className=" px-[4%] md:px-[8%] py-3.5 md:py-7 bg-[#F4F5F7]    dark:bg-black dark:text-gray-400 dark:border-b dark:border-t dark:border-gray-600 flex items-center justify-between ">
        <h2 className=" uppercase text-[17px] md:text-[24px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400 ">
          Checkout
        </h2>
        <div className=" flex items-center font-[500] plus-jakarta plus-jakarta text-[12px] md:text-[13.6px] ">
          <Link to="/">
            <span className=" uppercase text-[#FF7004] cursor-pointer ">
              Home
            </span>
          </Link>
          <span className=" px-1 ">/</span>
          <span className=" uppercase">Checkout</span>
        </div>
      </div>

      <div className=" md:px-[2%] xl:px-[8%] flex flex-col items-center lg:grid grid-cols-2 md:m-8 mb-14 ">
        <div className=" m-8 md:m-0 ">
          <div className=" flex flex-col ">
            <h4 className=" text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta text-[#363F4D] dark:text-gray-400 underline underline-offset-3 mb-1.5 ">
              Billing Address
            </h4>

            <div className=" flex flex-col sm:grid grid-cols-2 sm:gap-10 xl:gap-[13%] md:mt-6 ">
              <div className=" flex-col flex">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="first-name"
                >
                  First Name*
                </label>
                <input
                  name="firstName"
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={onChange}
                  className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="First Name"
                />
              </div>
              <div className=" flex-col flex">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="last-name"
                >
                  Last Name*
                </label>
                <input
                  name="lastName"
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={onChange}
                  className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className=" sm:grid grid-cols-2  ga2 md:mt-6 ">
              <div className=" flex-col flex mr-2">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="email"
                >
                  Email Address*
                </label>
                <div className=" flex w-full items-center justify-between border-[1.4px] border-[#999999] ">
                  <input
                    name="email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={onChange}
                    readOnly
                    className=" w-full  dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                    placeholder="Email"
                  />
                  {!isUserLoggedIn && hideVerifyButton == false && (
                    <button
                      onClick={() => {
                        sendOtp();
                      }}
                      className=" h-full px-1 bg-gray-300 text-xs font-semibold"
                    >
                      Verify
                    </button>
                  )}
                </div>
                {!isUserLoggedIn && isVerify && (
                  <div className=" flex w-full items-center justify-between mt-2 border-[1.4px] border-[#999999] ">
                    <input
                      name="number"
                      id="passwoed"
                      type="text"
                      value={VerCode}
                      onChange={(e) => {
                        setVerCode(e.target.value);
                      }}
                      className=" w-full md:w-[240px] 2xl:w-[300px] dark:bg-transparent    mt-1 p-2 text-[#7A7A7A] text-[14.4px]"
                      placeholder="Verification Code"
                    />
                    <button
                      className=" h-full px-1 bg-gray-300 text-xs font-semibold"
                      onClick={() => {
                        verifyOtp();
                      }}
                    >
                      Verify OTP
                    </button>
                  </div>
                )}
              </div>
              <div className=" flex-col flex">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="phone"
                >
                  Phone no*
                </label>
                <div className=" flex items-center border-[1.4px] border-[#999999]">
                  <select
                    value={phoneCode1}
                    onChange={(e) => {
                      setPhoneCode1(e.target.value);
                    }}
                    className=" w-[60px] h-full"
                  >
                    {phoneCode?.map((code, index) => {
                      return (
                        <option key={index} value={code?.dial_code}>
                          {code?.dial_code}
                        </option>
                      );
                    })}
                  </select>
                  <input
                    name="phone"
                    id="phone"
                    type="number"
                    value={phone}
                    onChange={onChange}
                    className=" w-full md:w-[240px] 2xl:w-[300px] ] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                    placeholder="Phone No."
                  />
                </div>
                {phone && phone.toString().length !== 10 && (
                  <p className="text-red-500 text-xs mt-1">Phone number must be 10 digits</p>
                )}
              </div>
            </div>

            <div className=" grid grid-cols-2 gap-4 md:gap-y-10 xl:gap-y-[13%] mt-3 md:mt-6 mb-1 ">
              <div className=" w-full col-span-2 ">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="Address"
                >
                  Address*
                </label>
                <input
                  name="addressLine1"
                  id="Address"
                  type="text"
                  value={addressLine1}
                  onChange={onChange}
                  className=" w-[100%] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Address line 1"
                />
              </div>
              <div className=" col-span-2">
                <input
                  name="addressLine2"
                  id="Address-line-2"
                  type="text"
                  value={addressLine2}
                  onChange={onChange}
                  className=" w-[100%] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Address line 2"
                />
              </div>
            </div>

            <div className=" sm:grid grid-cols-2 gap-10 xl:gap-[13%] md:mt-10 ">
              <div className=" flex-col flex">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="Country"
                >
                  Country*
                </label>
                <input
                  name="country"
                  id="Country"
                  type="text"
                  value={country}
                  onChange={onChange}
                  className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Country"
                />
              </div>
              <div className=" flex-col flex">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="city"
                >
                  Town/City*
                </label>
                <input
                  name="city"
                  id="city"
                  type="text"
                  value={city}
                  onChange={onChange}
                  className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Town/City"
                />
              </div>
            </div>

            <div className=" sm:grid grid-cols-2 gap-10 xl:gap-[13%] md:mt-6 ">
              <div className=" flex flex-col">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="State"
                >
                  State*
                </label>
                <input
                  name="state"
                  id="State"
                  type="text"
                  value={state}
                  onChange={onChange}
                  className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="State"
                />
              </div>
              <div className=" flex flex-col">
                <label
                  className=" text-[#7A7A7A] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                  htmlFor="Zip-Code"
                >
                  Zip Code*
                </label>
                <input
                  name="zipCode"
                  id="Zip-Code"
                  type="number"
                  value={zipCode}
                  onChange={onChange}
                  className=" w-full md:w-[240px] 2xl:w-[300px] border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
                  placeholder="Zip Code"
                />
              </div>
            </div>
          </div>
        </div>

        <div className=" w-full px-[5%] sm:px-[8%] flex flex-col justify-between  sm:m-8 md:mb-14 ">
          <div className=" ">
            <h4 className=" text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta text-[#363F4D] dark:text-gray-400 underline underline-offset-3 mb-1.5 ">
              Cart Total
            </h4>
            <div className=" flex flex-col p-5 bg-[#F2F2F2] dark:bg-white/5">
              <div className=" flex items-center justify-between text-[14px] md:text-[16px] 2xl:text-[18px] font-[700] plus-jakarta text-[#363F4D] dark:text-gray-400 mt-6 mb-5 ">
                <p>Product</p>
                <p>Total</p>
              </div>
              {param?.toLowerCase() === "buynow" ? (
                <>
                  {buyNow?.map((item, index) => {
                    const price = item.productId?.discountValue
                      ? item.productId.discountValue
                      : (item.productId?.price || item.updatedPrice);

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between font-[600] plus-jakarta tetx-[#363F4D] text-[13.4px] 2xl:text-[14.4px]"
                      >
                        <p className="text-[#7A7A7A] font-[600] plus-jakarta">
                          {item?.productId?.title?.slice(0, 50)}
                        </p>
                        <p className="text-[#363F4D] dark:text-gray-400 text-[600]">
                          {item.quantity || 1} x {currency}
                          {currency === "OMR"
                            ? (price * 0.1).toFixed(2)
                            : price}
                        </p>
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  {cart?.map((item, index) => {
                    const discountedPrice = item.productId?.discountValue
                      ? item.productId.discountValue
                      : item.updatedPrice;

                    return (
                      <div
                        key={index}
                        className=" flex items-center justify-between font-[600] plus-jakarta tetx-[#363F4D] text-[13.4px] 2xl:text-[14.4px] "
                      >
                        <p className=" text-[#7A7A7A] font-[600] plus-jakarta">
                          {item?.productId?.title?.slice(0, 50)}
                        </p>
                        <p className="text-[#363F4D] dark:text-gray-400 text-[600]">
                          {item.quantity} x {currency}
                          {currency === "OMR"
                            ? (discountedPrice * 0.1).toFixed(2)
                            : discountedPrice}
                        </p>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Cart Summary Section */}
              <div className="mt-3 py-1 border-t-[1px] border-[#999999] dark:bg-transparent flex items-center justify-between font-[700] plus-jakarta text-[12.4px] md:text-[13px] 2xl:text-[14px]">
                <p>Sub Total</p>
                <p>{currency} {currency === "OMR" ? (subTotal * 0.1).toFixed(2) : subTotal.toFixed(2)}</p>
              </div>

              {/* Product Discount */}
              {totalDiscount > 0 && (
                <div className="flex items-center justify-between font-[600] plus-jakarta text-[#363F4D] text-[13.4px] 2xl:text-[13px]:md:text-[14px]">
                  <p>Product Discount</p>
                  <p>-{currency} {currency === "OMR" ? (totalDiscount * 0.1).toFixed(2) : totalDiscount.toFixed(2)}</p>
                </div>
              )}

              {/* Amount after product discount */}
              <div className="flex items-center justify-between font-[600] plus-jakarta text-[#363F4D] text-[13.4px] 2xl:text-[13px]:md:text-[14px]">
                <p>Amount after discount</p>
                <p>{currency} {currency === "OMR" ? ((subTotal - totalDiscount) * 0.1).toFixed(2) : (subTotal - totalDiscount).toFixed(2)}</p>
              </div>

              {/* Coupon Discount */}
              {discountAmt > 0 && (
                <div className="flex items-center justify-between font-[600] plus-jakarta text-[#363F4D] text-[13.4px] 2xl:text-[13px]:md:text-[14px]">
                  <p>Coupon Discount</p>
                  <p>-{currency} {currency === "OMR" ? (discountAmt * 0.1).toFixed(2) : discountAmt.toFixed(2)}</p>
                </div>
              )}

              {/* Grand Total */}
              <div className="mt-3 py-1 border-t-[1px] border-[#999999] flex items-center justify-between font-[700] plus-jakarta text-[13px] md:text-[16px] 2xl:text-[18px]">
                <p>Grand Total</p>
                <p>{currency} {currency === "OMR" ? (total * 0.1).toFixed(2) : total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="  mt-4">
            {loading ? (
              <div className=" w-full flex items-center justify-center py-3">
                <img
                  src="/Images/loader.svg"
                  alt="loading..."
                  className=" object-contain w-[60px] h-[60px]"
                />
              </div>
            ) : (
              <button
                className=" bg-[#363F4D] disabled:bg-gray-400 disabled:border-gray-400  border-[1.4px] border-[#363F4D] px-4 py-2.5 font-medium uppercase text-[13px] text-white mt-6 "
                onClick={handlePhonePeCheckout}
                disabled={loading || !isFormValid()}
              >
                Place order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
