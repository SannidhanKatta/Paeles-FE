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
import Featured2 from "@/components/Featured2";
import { Helmet } from "react-helmet";
import PopupModal from "@/components/PopupModal";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import parse from "html-react-parser";
import { gsap } from 'gsap';
import { FaStar } from "react-icons/fa";

const box = [
  {
    icon: "/ship.png",
    text: "FREE SHIPPING",
    describe: "Order Above 1500",
  },
  { icon: "/free.png", text: "FREE ASSEMBLY", describe: "On all orders" },
  { icon: "/bell.png", text: "WARRANTY", describe: "one year Warranty" },
  {
    icon: "/secure.png",
    text: "SECUREE PAYMENTS",
    describe: "Safe, Fast & Secure",
  },
];
// const categories = [
//   { icon: "/main/hm1.svg", text: "Living Room", param: "livingroom" },
//   { icon: "/main/hm2.svg", text: "Bed Room", param: "bedroom" },
//   { icon: "/main/hm3.svg", text: "Dinnining Room", param: "dinningroom" },
//   { icon: "/main/hm4.svg", text: "Office", param: "office" },
//   { icon: "/main/hm5.svg", text: "hospitality", param: "hospitality" },
//   { icon: "/main/hm6.svg", text: "Outdoor", param: "outdoor" },
// ];
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
    describe: "Order Above ₹ 1500",
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
  const { wishlist, setWishlist } = useContext(AppContext);

  const [filteredCategory, setFilteredCategory] = useState("New Arrivals");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [catalogueImage, setCatalogueImage] = useState(null);
  const [catalogueLinks, setCatalogueLinks] = useState(["", "", ""]);
  const [slider, setSlider] = useState([]);
  const [showModal, setShowModal] = useState(true);
  // const [testimonialsData, setTestimonialsData] = useState([]);
  const { wishlistedProducts, handleAddToWishlist, handleRemoveWishlist } =
    useContext(MainAppContext);
  const [topProducts, setTopProducts] = useState([]); // New state variable for top products

  const getAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product/all`
      );
      // console.log(response.data);
      setFilteredProducts(response.data);
      const chunkedArray = [];
      for (let i = 0; i < response?.data?.length; i += 10) {
        chunkedArray.push(response?.data?.slice(i, i + 10));
      }
      // console.log(chunkedArray);
      setNewProducts(chunkedArray);
      setTopProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };
  const getAllBanners = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/banners`);
      setBanners(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };
  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/category`
      );
      // console.log(response.data.categories);
      setCategories(response.data?.categories);
      // // // console.log(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getAllBlogs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/blogs`
      );
      console.log(response.data);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getCatalogue = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/catalogue`
      );
      console.log(response.data.catalogue);
      setCatalogueImage(response.data.catalogue.image);
      setCatalogueLinks(response.data.catalogue.links);
    } catch (error) {
      console.error("Error fetching catalogue:", error);
    }
  };

  const getSlider = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/slider`
      );
      console.log(response.data);
      setSlider(response.data);
    } catch (error) {
      console.error("Error fetching catalogue:", error);
    }
  };

  // const fetchTestimonials = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_SERVER_URL}/testimonial`
  //     );
  //     console.log(response.data);
  //     if (response.data) {
  //       setTestimonialsData(response.data);
  //     } else {
  //       console.error("API response does not contain a valid testimonial data");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching testimonials:", error);
  //   }
  // };

  const truncateContent = (htmlContent, wordLimit) => {
    const textContent = htmlContent.replace(/<[^>]+>/g, "");
    const words = textContent.split(/\s+/);
    if (words.length <= wordLimit) {
      return htmlContent;
    }
    const truncatedText = words.slice(0, wordLimit).join(" ") + "...";
    return parse(truncatedText);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getAllProducts();
    getAllBanners();
    getAllCategories();
    getAllBlogs();
    getCatalogue();
    getSlider();
    // fetchTestimonials();
    // setWishlistedProducts(wishlist);
    gsap.from('.fade-in', { duration: 1, opacity: 0, y: 50 });
  }, []);

  return (
    <section>
      <div data-aos="fade-up" data-aos-duration="1000">
        <Helmet>
          <title>{"PAELESS"} </title>
          <meta name="description" />
          <meta name="description" content={"PAELESS"} />
          {/* <meta name="keywords" content={} /> */}
          <meta name="author" content={"PAELESS"} />
          {/* Add more meta tags as needed */}
        </Helmet>
        {showModal && <div className="modal-overlay" />}
        {showModal && <PopupModal onClose={() => setShowModal(false)} />}
        <div className="flex flex-col">
          <HeroSlider slider={slider} />
          {/* <CategorySlider data={categories} /> */}
          {/* <div className="w-full grid gap-3 grid-cols-2 md:grid-cols-3 px-[2%] mb-10">
            {categories
              ?.filter((i) => {
                return i?.selected === true;
              })
              .slice(0, 6)
              ?.map((item, index) => {
                return (
                  <Link to={`/shop/${item?.fileName}/all`} key={index}>
                    <div className=" pl-2 md:pl-2 pb-2 md:pb-2">
                      <div className=" relative shade_image">
                        <p
                          style={{ writingMode: "vertical-rl" }}
                          className="text-[#353535] absolute -left-0 md:-left-0 top-4 rotate-180 plus-jakarta font-[600] text-[10px] md:text-2xl capitalize flex items-center justify-center"
                        >
                          {item?.fileName}
                        </p>
                        <img
                          className=" object-cover object-center h-[116px] lg:h-[302px] "
                          src={item?.imageLink}
                          alt={item.param}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div> */}

          <div className="dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-5">
            <div className="flex flex-col items-center col-span-4">
              <p className="text-[24px] md:text-[28px] 2xl:text-[32px] plus-jakarta font-[700] text-[#212121] dark:text-gray-400">
                Categories
              </p>
              <p className="text-[#474747] text-center text-[13px] md:text-[14.5px] 2xl:text-[16px] mb-4 dark:text-gray-400">
                Explore our categories to find what you need
              </p>
              <div className="flex items-center flex-wrap justify-center gap-6">
                {categories.map((item, index) => (
                  <Link to={`/shop/${item?.fileName}/all`} key={index} className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                      <img
                        className="object-cover w-full h-full"
                        src={item?.imageLink}
                        alt={item.param}
                      />
                    </div>
                    <span className="mt-2 text-center text-[#474747]">{item?.fileName}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="dark:text-gray-400 flex flex-col items-center lg:grid xl:grid-cols-4 gap-6 px-[4%] xl:px-[8%] py-4 mt-5">
            <div className="flex flex-col items-center col-span-4">
              <p className="text-[24px] md:text-[28px] 2xl:text-[32px] font-[700] plus-jakarta text-[#212121] dark:text-gray-400">
                Our Featured Products
              </p>
              <p className="text-[#474747] text-center text-[13px] md:text-[14.5px] 2xl:text-[16px] mb-4 dark:text-gray-400">
                Discover our top picks! Explore unique, high-quality items that add style and comfort to your everyday look.
              </p>
            </div>
          </div>
          {loading ? (
            <div className="w-full flex items-center justify-center py-3">
              <img
                src="/Images/loader.svg"
                alt="loading..."
                className="object-contain w-[60px] h-[60px]"
              />
            </div>
          ) : (
            <>
              <div className="w-full col-span-4">
                {/* {// console.log(filteredProducts)} */}
                <Featured2
                  products={topProducts}
                  newProducts={newProducts}
                  filteredCategory={filteredCategory}
                  wishlistedProducts={wishlistedProducts}
                />
              </div>
            </>
          )}


          <div className="w-full flex px-[8%] mx-auto relative">
            {banners.find((banner) => banner.fileName === "Banner1") && (
              <div className="relative w-full flex justify-center items-center shade_image">
                <img
                  className="h-full object-contain"
                  src={
                    banners.find((banner) => banner.fileName === "Banner1")
                      ?.filePath
                      ? banners.find((banner) => banner.fileName === "Banner1")
                        .filePath
                      : "/main/discount_banner.jpg"
                  }
                  alt="slide-Image"
                />
                <div className="absolute bottom-30 left-0 right-0 p-4 flex justify-between items-end w-full">
                  <div className="p-2 rounded">
                    <h2 className="text-xl md:text-2xl font-bold text-black">
                      {
                        banners.find((banner) => banner.fileName === "Banner1")
                          .title
                      }
                    </h2>
                    <p className="text-sm md:text-base text-black pb-3">
                      {
                        banners.find((banner) => banner.fileName === "Banner1")
                          .description
                      }
                    </p>
                    <a
                      href={
                        banners
                          .find((banner) => banner.fileName === "Banner1")
                          .redirectUrl.startsWith("http")
                          ? banners.find((banner) => banner.fileName === "Banner1")
                            .redirectUrl
                          : `${banners.find(
                            (banner) => banner.fileName === "Banner1"
                          ).redirectUrl
                          }`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-orange-600 text-white px-4 py-2 rounded shadow-md hover:bg-orange-700 transition duration-300"
                    >
                      {
                        banners.find((banner) => banner.fileName === "Banner1")
                          .buttonContent
                      }
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000">
        {/* Your content here */}
      </div>
    </section>
  );
};

export default Home;