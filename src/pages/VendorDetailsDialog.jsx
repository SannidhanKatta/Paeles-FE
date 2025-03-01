import axios from "axios";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const VendorDetailsDialog = ({ close, data, heading }) => {
  console.log(data);
  const [isEditOrder, setIsEditOrder] = useState(false);
  const [editOrder, setEditOrder] = useState(data);
  const [customerDetails, setCustomerDetails] = useState({
    id: data?.customer?._id,
    name: data?.customer?.name || "",
    email: data?.customer?.email || "",
    address: `${data?.customer?.address},${data.customer?.city},${data.customer?.state},${data.customer?.country},${data.customer?.zipCode}` || "",
    phone: data?.customer?.phone || "",

  });

  const updateDetails = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/admin/updateCustomer`,
        customerDetails
      );
      // Handle the response accordingly
      console.log("Customer updated successfully:", response.data);
      toast.success(response.data.message);
      setIsEditOrder(false);
    } catch (error) {
      console.error("Error updating order:", error);
      toast.success(error.response.data.error);
    }
  };

  return (
    <>
      <div className="  fixed inset-0 w-full h-[100vh] flex items-center justify-center bg-black/80  overflow-y-scroll z-50 ">
        <div className=" relative w-[100%] h-[100%] md:w-[70%] rounded-lg  items-center justify-end md:h-[80%]  dark:text-black bg-white p-3 md:px-20 md:py-10 capitalize overflow-y-scroll">
          <div className=" w-full justify-end flex items-center">
            <IoClose
              onClick={() => {
                close();
              }}
              className="   -top-8 cursor-pointer right-0 bg-orange-400 p-1 text-[29px]"
            />
          </div>
          <div className=" ">
            <div>
              <div className=" flex items-center mb-3  gap-4">
                <h2 className=" font-bold plus-jakarta text-xl ">{heading}</h2>
                {/* <FiEdit
                  onClick={() => {
                    setIsEditOrder((prev) => (prev === true ? false : true));
                  }}
                  className=" text-[17px] md:text-[20px] cursor-pointer"
                /> */}
              </div>
              {data?._id && (
                <p>
                  <span className=" text-sm md:text-md font-semibold mr-1">
                    Id:
                  </span>
                  {data?._id}
                </p>
              )}
              {data?.reviewId && (
                <p>
                  <span className=" text-sm md:text-md font-semibold mr-1">
                    reviewId:
                  </span>
                  {data?.reviewId}
                </p>
              )}

              {data?.orderId && (
                <p>
                  <span className=" text-sm md:text-md font-semibold mr-1">
                    orderId:
                  </span>
                  {data?.orderId}
                </p>
              )}

              <p className=" mt-2 font-bold plus-jakarta">Customer Details</p>
              <p>
                <span className=" text-sm md:text-md font-semibold mr-1">
                  Name:
                </span>
                <p
                  className=" py-2 px-4 inline mt-1"
                >
                  {customerDetails.name}
                </p>
              </p>
              <p>
                <span className=" text-sm md:text-md font-semibold mr-1">
                  Email:
                </span>
                <p
                  className=" py-2 px-4 inline mt-1"
                >
                  {customerDetails.email}
                </p>
              </p>
              <p>
                <span className=" text-sm md:text-md font-semibold mr-1">
                  address:
                </span>
                <p
                  className=" py-2 px-4 inline mt-1"
                >
                  {customerDetails.address}
                </p>
              </p>
              <p>
                <span className=" text-sm md:text-md font-semibold mr-1">
                  Phone:
                </span>
                <p
                  className=" py-2 px-4 inline mt-1"
                >
                  +91 {customerDetails.phone}
                </p>
              </p>

              <p className=" mt-5 font-bold plus-jakarta">Order Details</p>
              {data?.products?.map((product, index) => {
                console.log(product);
                return (
                  <div
                    key={index}
                    className=" p-2 md:p-4 my-3 text-sm md:text-md shadow-md shadow-black/40"
                  >
                    <img src={product?.product?.mainImage} className=" w-[100px]" />
                    <p>
                      <span className=" text-sm md:text-md font-semibold mr-1">
                        Name:
                      </span>
                      {product?.product?.title}
                    </p>
                    <p>
                      <span className=" text-sm md:text-md font-semibold mr-1">
                        Price:
                      </span>
                      {product?.product?.price}
                    </p>
                    <p>
                      <span className=" text-sm md:text-md font-semibold mr-1">
                        Status:
                      </span>
                      {product?.product?.status}
                    </p>
                    <p>
                      <span className=" text-sm md:text-md font-semibold mr-1">
                        selected size:
                      </span>
                      {product?.selectedSize}
                    </p>
                    <p>
                      <span className=" text-sm md:text-md font-semibold mr-1">
                        quantity:
                      </span>
                      {product?.quantity}
                    </p>
                  </div>
                );
              })}

              {data?.productId?.title && (
                <p>
                  <span className=" text-sm md:text-md font-semibold mr-1">
                    title:
                  </span>
                  {data?.productId?.name}
                </p>
              )}
              {data?.email && (
                <p>
                  <span className=" text-sm md:text-md font-semibold mr-1">
                    email:
                  </span>
                  {data?.email}
                </p>
              )}
              {data?.product && (
                <p>
                  <span className=" text-sm md:text-md font-semibold mr-1">
                    product:
                  </span>
                  {data?.product}
                </p>
              )}
              {data?.date && (
                <p>
                  <span className=" text-sm md:text-md font-semibold mr-1">
                    date:
                  </span>
                  {data?.date}
                </p>
              )}
              {data?.rating && (
                <p>
                  <span className=" text-sm md:text-md font-semibold mr-1">
                    rating:
                  </span>
                  {data?.rating}
                </p>
              )}
              {data?.weight && (
                <p>
                  <span className=" text-sm md:text-md font-semibold mr-1">
                    weight:
                  </span>
                  {data?.weight}
                </p>
              )}
              {data?.total && (
                <p>
                  <span className=" text-sm md:text-md font-semibold mr-1">
                    total:
                  </span>
                  {data?.total}
                </p>
              )}
              {data?.status && (
                <p>
                  <span className=" text-sm md:text-md font-semibold mr-1">
                    status:
                  </span>
                  {data?.status}
                </p>
              )}
              {data?.review && (
                <p>
                  <span className=" text-sm md:text-md font-semibold mr-1">
                    review:
                  </span>
                  {data?.review}
                </p>
              )}
              {data?.couponCode && (
                <p>
                  <span className=" text-sm md:text-md font-semibold mr-1">
                  Coupon Code:
                  </span>
                  {data?.couponCode}
                </p>
              )}
            </div>
            <div>
              {data?.image && (
                <img
                  className=" h-[80%] w-full object-cover"
                  src={data?.image}
                  alt="product-img"
                />
              )}
            </div>
            {isEditOrder && (
              <button
                onClick={updateDetails}
                title="view order"
                className="bg-[#FF7004] px-4 py-2.5 my-1 w-[100px] sm:w-[150px] lg:w-full mx-auto font-medium text-[11.2px] md:text-[13px] text-white"
              >
                Update
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorDetailsDialog;
