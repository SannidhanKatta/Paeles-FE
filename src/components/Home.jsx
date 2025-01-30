import React, { useContext, useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import NewsSlider from "../components/NewsSlider";
import CategorySlider from "../components/CategorySlider";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { IoHeartCircle } from "react-icons/io5";
import axios from "axios";
import { MainAppContext } from "@/context/MainContext";
import Featured from "@/components/Featured";
import { TiTick, TiWorld } from "react-icons/ti";
import { BsBellFill, BsClock } from "react-icons/bs";
import { FaTshirt, FaShoePrints, FaNecklace } from "react-icons/fa";

const Process = [
  {
    number: "01",
    text: "First, a conversation sparks off the magic",
    describe: `Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
    eiusmo tempor incididunt ut labore`,
  },
  {
    number: "02",
    text: "Next, co-creation begins, with a site visit.",
    describe: `Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
    eiusmo tempor incididunt ut labore`,
  },
  {
    number: "03",
    text: "Finally the dream comes alive.",
    describe: `Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo tempor incididunt ut labore Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
    eiusmo tempor incididunt ut labore`,
  },
];
const feature = [
  {
    icon: <TiWorld className=" text-[19px] " />,
    text: "FREE SHIPPING",
    describe: "Order Above AED 1500",
  },
  {
    icon: <TiTick className=" text-[19px] " />,
    text: "FREE ASSEMBLY",
    describe: "On all orders",
  },
  {
    icon: <BsBellFill className=" text-[20px] " />,
    text: "WARRANTY",
    describe: "one year Warranty",
  },
  {
    icon: <BsClock className=" text-[19px] " />,
    text: "SECURE PAYMENTS",
    describe: "Safe, Fast & Secure",
  },
];
const news = [
  {
    icon: "/Images/news.png",
    text: "Interior design is the art.",
    date: "16 March",
    button: "Read More",
    describe: "Lorem ipsum dolor sit amet, consectetur adipi elit, sed.",
  },
  {
    icon: "/Images/news.png",
    text: "Interior design is the art.",
    date: "16 March",
    button: "Read More",
    describe: "do eiusmod tempor incididu ut labore et dolore magna",
  },
  {
    icon: "/Images/news.png",
    text: "Interior design is the art.",
    date: "16 March",
    button: "Read More",
    describe: "do eiusmod tempor incididu ut labore et dolore magna.",
  },
];

const Home = () => {
  const { currency, wishlist, setWishlist } = useContext(AppContext);

  const [filteredCategory, setFilteredCategory] = useState("New Arrivals");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const { wishlistedProducts, handleAddToWishlist, handleRemoveWishlist } =
    useContext(MainAppContext);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product/all`
      );
      // console.log(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const getAllBanners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/banner`
      );
      setBanners(response.data?.banners);
      // // // console.log(response.data.banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };
  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/category`
      );
      console.log(response.data.categories);
      setCategories(response.data?.categories);
      // // console.log(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getAllProducts();
    getAllBanners();
    getAllCategories();
    // setWishlistedProducts(wishlist);
  }, []);

  return (
    <section className="off-white w-full dark:bg-black dark:text-white">
      {/* <HeroSlider /> */}
      <CategorySlider data={categories} />
      {/* <div className=" relative text-white w-full h-fit md:h-[530px] flex flex-col items-center justify-center ">
        <img
          className=" w-full h-full object-fill md:object-cover"
          src="/main/mainBanner.svg"
          alt="slide-Image"
        /> */}

      {/* <div className=" absolute flex flex-col">
          <p className=" text-[15px] md:text-[17px] 2xl-text-[20px] uppercase text-left ">
            New Arrivals
          </p>
          <p className=" text-[20px] md:text-[40px] 2xl-text-[48px] w-[70%] leading-10 mt-1 mb-4 font-[700] plus-jakarta text-left -ml-1 ">
            Corporis nulla luxurious bedroom
          </p> 
          <button className="  font-semibold  w-fit px-4 py-2 uppercase text-[11px] md:text-[13px]">
            Shop Now
          </button> */}
      {/* </div> */}
      {/* </div> */}
      <CategorySlider data={categories} />
      <div className="w-full grid gap-3 grid-cols-2 md:grid-cols-3 px-[8%] mb-10">
        {categories
          ?.filter((i) => {
            return i?.selected === true;
          })
          .slice(0, 6)
          ?.map((item, index) => {
            return (
              <Link to={`/shop/${item?.fileName}/all`} key={index}>
                <div className=" pl-5 md:pl-10">
                  <div className=" relative">
                    <p
                      style={{ writingMode: "vertical-rl" }}
                      className=" absolute -left-5 md:-left-8 rotate-180 font-bold plus-jakarta text-[10px] md:text-3xl capitalize flex items-center justify-center"
                    >
                      {item?.fileName}
                    </p>
                    <img
                      className=" object-fill h-[100px] lg:h-[350px] "
                      src={item?.imageLink}
                      alt={item.param}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      <div className="w-full flex items-center flex-wrap justify-center px-[8%] mb-10">
        {feature.map((item, index) => {
          return (
            <div
              key={index}
              className=" text-gray-700 relative flex items-center  w-[230px] gap-3 border border-gray-500 p-2 px-3"
            >
              <div className=" border border-gray-700 rounded-full p-1.5">
                {item.icon}
              </div>
              <div className=" flex flex-col">
                <p className="  font-semibold text-xs md:text-[13px]  capitalize ">
                  {item.text}
                </p>
                <p className="  text-[12.5px]  capitalize ">{item.describe}</p>
              </div>
            </div>
          );
        })}
      </div>


      <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-5 ">
        <div className=" flex flex-col items-center col-span-4">
          <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400 ">
            Our Products
          </p>
          <p className=" text-[#474747] text-center text-[13px] md:text-[14.5px] 2xl:text-[16px] mb-4 dark:text-gray-400 ">
            Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
            eiusmo tempor incididunt ut labore
          </p>
          <div className=" flex items-center flex-wrap justify-center gap-2 md:gap-6 font-[600] plus-jakarta text-[#474747] dark:text-gray-400 text-[13px] md:text-[17px] ">
            {/* <span
              className={`cursor-pointer ${
                filteredCategory === "discount" && "text-[#FF7004]"
              }`}
              onClick={() => {
                setFilteredCategory("discount");
              }}
            >
              Discount
            </span> */}
            <span
              className={`cursor-pointer ${filteredCategory === "New Arrivals" && "text-[#FF7004]"
                }`}
              onClick={() => {
                setFilteredCategory("New Arrivals");
              }}
            >
              New Arrivals
            </span>
            <span
              className={`cursor-pointer ${filteredCategory === "Featured" && "text-[#FF7004]"
                }`}
              onClick={() => {
                setFilteredCategory("Featured");
              }}
            >
              Featured
            </span>
            <span
              className={`cursor-pointer ${filteredCategory === "Best Sellers" && "text-[#FF7004]"
                }`}
              onClick={() => {
                setFilteredCategory("Best Sellers");
              }}
            >
              Best Sellers
            </span>
            <span
              className={`cursor-pointer ${filteredCategory === "Sale Items" && "text-[#FF7004]"
                } `}
              onClick={() => {
                setFilteredCategory("Sale Items");
              }}
            >
              Sale Items
            </span>
            <span
              className={`${filteredCategory === "On Sales" && "text-[#FF7004]"
                } cursor-pointer`}
              onClick={() => {
                setFilteredCategory("On Sales");
              }}
            >
              On Sales
            </span>
          </div>

        </div>
      </div>
      <div className="w-full col-span-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {filteredCategory === "New Arrivals"
            ? [...filteredProducts]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 10)
              .map((pro, index) => (
                <div key={index} className="relative flex flex-col items-center">
                  <Link
                    to={`/product/${pro?.title?.replace(/\//g, "").replace(/\s+/g, "-")}?productId=${pro?._id}`}
                    className="flex items-center">
                    <img
                      className="h-[220px] w-full lg:h-[250px] xl:h-[310px]"
                      src={pro.mainImage}
                      alt="product-img"
                    />
                  </Link>
                  <p className="text-center font-[500] mt-2 mb-1">{pro.title}</p>
                  <p className="text-sm md:text-base text-center">
                    {pro.currency} {pro.price}
                  </p>
                </div>
              ))
            : filteredProducts.slice(0, 10).map((pro, index) => (
              <div key={index} className="relative flex flex-col items-center">
                <Link 
                to={`/product/${pro?.title?.replace(/\//g, "").replace(/\s+/g, "-")}?productId=${pro?._id}`}
                className="flex items-center">
                  <img
                    className="h-[220px] w-full lg:h-[250px] xl:h-[310px]"
                    src={pro.mainImage}
                    alt="product-img"
                  />
                </Link>
                <p className="text-center font-[500] mt-2 mb-1">{pro.title}</p>
                <p className="text-sm md:text-base text-center">
                  {pro.currency} {pro.price}
                </p>
              </div>
            ))}
        </div>
      </div>
      <div className=" dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-2 ">
        <div className=" flex flex-col items-center py-10 col-span-4">
          <p className=" text-[24px] md:text-[28px] 2xl:text-[35px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400 ">
            The Process
          </p>
          <p className=" text-[#474747] text-center text-[13px] md:text-[14px] 2xl:text-[15px] md:w-[40%] mb-4 dark:text-gray-400 ">
            Torem ipsum dolor sit amet, consectetur adipisicing elitsed do
            eiusmo tempor incididunt ut labore
          </p>
          <div className=" grid grid-cols-1 gap-5 md:grid-cols-3">
            {Process.map((item, index) => {
              return (
                <div
                  key={index}
                  className=" text-gray-700 relative flex flex-col items-center  gap-3 p-2 px-3"
                >
                  <p className="  text-[30px] plus-jakarta md:text-[59px] font-bold plus-jakarta text-[#212121] dark:text-gray-400  capitalize ">
                    {item.number}
                  </p>
                  <p className="  font-semibold  text-[15.6px] md:h-[60px] text-center md:text-[17.5px] text-[#212121] dark:text-gray-400 capitalize ">
                    {item.text}
                  </p>
                  <p className="  text-[12.4px] md:text-[13.4px] font-medium text-[#474747] dark:text-gray-400 text-center capitalize ">
                    {item.describe}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className=" relative text-white overflow-x-hidden w-full h-[300px] md:h-[530px] flex flex-col items-center justify-center ">
        <img
          className=" w-full h-full object-cover"
          src={`${!banners[2]?.filePath
            ? banners[2]?.filePath
            : "/main/mainBanner2.svg"
            }`}
          // src="/main/mainBanner2.svg"
          alt="slide-Image"
        />

        <div className=" absolute flex flex-col items-center justify-center gap-20 bg-black/50 w-full h-full top-0 left-0">
          <p className=" playball text-[15px] md:text-[17px] 2xl-text-[30px] scale-[1.5] 2xl:scale-[3] uppercase text-left ">
            Discover Our
          </p>
          <p className=" uppercase poppins text-[20px] md:text-[40px] font-semibold 2xl-text-[500px] scale-[2] 2xl:scale-[3.5] ">
            CATALOGUE
          </p>
          <div className=" w-full flex items-center justify-around ">
            <button className="  font-semibold underline  w-fit px-4 py-2 uppercase text-[11px] md:text-xl">
              View Catalogue 1
            </button>
            <button className="  font-semibold underline  w-fit px-4 py-2 uppercase text-[11px] md:text-xl">
              View Catalogue 2
            </button>
            <button className="  font-semibold underline  w-fit px-4 py-2 uppercase text-[11px] md:text-xl">
              View Catalogue 3
            </button>
          </div>
        </div>
      </div>
      <div className="dark:text-gray-400 flex flex-col items-center col-span-4 mt-10">
        <p className=" text-[24px] md:text-[28px] 2xl:text-[32px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400">
          Latest News
        </p>
        <p className=" dark:text-gray-400 text-[#474747] w-[90%] md:w-[50%] text-center text-[13px] md:text-[14.5px] 2xl:text-[16px] mb-4 ">
          Torem ipsum dolor sit amet, consectetur adipisicing elitsed do eiusmo
          tempor incididunt ut labore eiusmo tempor incididunt ut labore
        </p>
      </div>
      <NewsSlider />

    </section>
  );
};

export default Home;