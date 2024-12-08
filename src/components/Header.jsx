import { useContext, useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Menu } from "@headlessui/react";
import { Link } from "react-router-dom";
import { RiMenu3Fill, RiMenuSearchFill, RiMenu3Line } from "react-icons/ri";
import { AppContext } from "../context/AppContext";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoHeart, IoHeartOutline, IoMoonSharp, IoCall, IoCartOutline } from "react-icons/io5";
import { MainAppContext } from "@/context/MainContext";
import { useAuth } from "@/context/AuthContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { mainlogo } from "../../public/index.js";
const NavList = [
  {
    id: 1,
    name: "Home",
    link: "/",
  },
  {
    id: 2,
    name: "OFFICE",
    dropdownList: [
      {
        id: "2.1",
        name: "link 1",
        link: "/",
      },
    ],
  },
  {
    id: 3,
    name: "HOSPITALITY",
    dropdownList: [
      {
        id: "3.1",
        name: "link 1",
        link: "/",
      },
      {
        id: "3.2",
        name: "link 1",
        link: "/",
      },
      {
        id: "3.3",
        name: "link 1",
        link: "/",
      },
    ],
  },
  {
    id: 4,
    name: "OUTDOOR ",
    dropdownList: [
      {
        id: "4.1",
        name: "link 1",
        link: "/",
      },
      {
        id: "4.2",
        name: "link 1",
        link: "/",
      },
      {
        id: "4.3",
        name: "link 1",
        link: "/",
      },
      {
        id: "4.4",
        name: "link 1",
        link: "/",
      },
    ],
  },
  {
    id: 5,
    name: "UNIQUE",
    link: "/",
  },
  {
    id: 6,
    name: "HOW IT WORKS",
    link: "/",
  },
  {
    id: 7,
    name: "BECOME A PARTNER",
    link: "/",
  },
];
const Header = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    SetIsCartOpen,
    SetIsMenuOpen,
  } = useContext(AppContext);
  const { isDarkMode, SetIsDarkMode, cartCount, setCartCount } =
    useContext(MainAppContext);
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  const [userDetails, setUserDetails] = useState({});
  const [viewLogin, setViewLogin] = useState(false);
  const [viewCartLogin, setViewCartLogin] = useState(false);
  const [viewNavOptions, setViewNavOptions] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [menu, setMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    setUserDetails(user);
    if (userLoggedIn) {
      getCart(user?._id);
    } else {
      var tempCart = JSON.parse(localStorage.getItem("cart")) || [];
      // console.log(tempCart);
      setCartCount(tempCart?.length);
    }
    var themeMode = localStorage.getItem("darkMode");
    if (themeMode === "dark") {
      return SetIsDarkMode(true);
    } else {
      return SetIsDarkMode(false);
    }
  }, []);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserDetails(user);
    if (userLoggedIn) {
      getCart(user?._id);
    } else {
      var tempCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(tempCart?.length);
      // // console.log(tempCart);
    }
  }, [userLoggedIn]);

  const getCart = async (userId) => {
    // // console.log(userLoggedIn);
    if (userLoggedIn) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/cart/${userDetails?._id || userId
          }`
        );
        console.log(response.data.cart);
        setCartCount(
          response.data.cart.products?.length !== 0
            ? response.data.cart.products?.length
            : 0
        );
        // // console.log(response.data.cart.products?.length);
      } catch (error) {
        console.error("Error Fetching Cart", error);
      }
    } else {
      return;
    }
  };
  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    // // console.log(user.role);
    setUserDetails(user);
    if (userLoggedIn) {
      // console.log(user?._id);
      getCart(user?._id);
    }
  }, [userLoggedIn]);

  useEffect(() => {
    // Function to fetch the menu from the backend
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/admin/menu`
        );
        setMenu(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    // Call the fetchMenu function when the component mounts
    fetchMenu();
  }, []);

  useEffect(() => {
    // Fetch categories from an API or define them statically
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/category`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full">
      <div className="px-[3%] md:px-[8%] py-4 flex items-center justify-between bg-white dark:bg-white dark:text-black bottom-shadow">
        {/* Hamburger menu for mobile */}
        <div className="lg:hidden">
          <RiMenu3Line
            className="text-2xl cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src={mainlogo}
            className="w-[100px] md:w-[150px]"
            alt="PAELES"
          />
        </Link>

        {/* Comment out desktop search bar */}
        {/* <div className="hidden md:flex flex-grow mx-4 max-w-xl">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search your products here"
              className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <img
                className="w-5 h-5"
                src="/logos/Search.svg"
                alt="search"
              />
            </button>
          </div>
        </div> */}

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* <Link to="tel:600 505253" className="hidden md:flex items-center">
            <IoCall className="text-[20px] text-[#353535] mr-2" />
            <span className="text-[#353535]">600 505253</span>
          </Link> */}
          <Link to="/cart" className="relative">
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {cartCount || 0}
            </span>
            <IoCartOutline className="text-[22px] text-[#353535]" />
          </Link>
          <Link to={userLoggedIn ? "/wishlist" : "/login"} className="hidden md:block">
            <IoHeartOutline className="text-[20px] text-[#353535]" />
          </Link>
          <Link to={userLoggedIn ? "/profile" : "/login"} className="hidden md:block">
            <img
              className="w-[18px] h-[18px] object-contain cursor-pointer"
              src="/logos/Person.svg"
              alt="profile"
            />
          </Link>
          {userLoggedIn && userDetails && (userDetails?.role === "vendor" || userDetails?.role === "admin") && (
            <div className="relative hidden md:block">
              {/* <BsThreeDotsVertical
                className="cursor-pointer text-[18px]"
                onClick={() => setViewNavOptions((prev) => !prev)}
              /> */}
              {viewNavOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                  {/* ... (existing dropdown menu items) ... */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800 py-2 px-4">
          <div className="flex flex-col space-y-2">
            {/* Comment out mobile search bar */}
            {/* <input
              type="text"
              placeholder="Search your products here"
              className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> */}
            <Link to="/" className="py-2">Home</Link>
            <Link to="/shop/all/all" className="py-2">Shop</Link>
            <Link to="/about" className="py-2">About</Link>
            <Link to="/contact" className="py-2">Contact</Link>
            {userLoggedIn && (
              <>
                <Link to="/wishlist" className="py-2">Wishlist</Link>
                <Link to="/profile" className="py-2">Profile</Link>
              </>
            )}
            {!userLoggedIn && (
              <Link to="/login" className="py-2">Login</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;