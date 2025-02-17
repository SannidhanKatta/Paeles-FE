import { useContext, useEffect, useState, useRef } from "react";
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
  const mobileMenuRef = useRef(null);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const sideNavRef = useRef(null);

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
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/category`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }

    // Add event listener when menu is open
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close sidenav when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
        setIsSideNavOpen(false);
      }
    }

    if (isSideNavOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSideNavOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserLoggedIn(false);
    toast.success("Successfully logged out");
    navigate("/");
  };

  return (
    <div className="w-full sticky top-0 z-[999] bg-white shadow-md">
      {/* Main Header */}
      <div className="px-[3%] md:px-[8%] py-4 flex items-center justify-between bg-white dark:bg-white dark:text-black">
        {/* Menu Toggle - Only show on mobile */}
        <div className="block md:hidden">
          {isSideNavOpen ? (
            <RiMenu3Fill
              className="text-2xl cursor-pointer"
              onClick={() => setIsSideNavOpen(false)}
            />
          ) : (
            <RiMenu3Line
              className="text-2xl cursor-pointer"
              onClick={() => setIsSideNavOpen(true)}
            />
          )}
        </div>

        {/* Logo - Centered on mobile, left-aligned on desktop */}
        <Link to="/" className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none md:left-0">
          <img src={mainlogo} className="w-[100px] md:w-[150px]" alt="PAELESS" />
        </Link>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          {/* Cart icon - visible on all screens */}
          <Link to="/cart" className="relative">
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {cartCount || 0}
            </span>
            <IoCartOutline className="text-[22px] text-[#353535]" />
          </Link>

          {/* Other icons - only visible on desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to={userLoggedIn ? "/wishlist" : "/login"}>
              <IoHeartOutline className="text-[20px] text-[#353535]" />
            </Link>
            <Link to={userLoggedIn ? "/profile" : "/login"}>
              <img
                className="w-[18px] h-[18px] object-contain cursor-pointer"
                src="/logos/Person.svg"
                alt="profile"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Side Navigation */}
      <div
        ref={sideNavRef}
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[1000] ${isSideNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-4">
          {/* User Section */}
          {userLoggedIn ? (
            <div className="mb-6 p-4 border-b">
              <p className="font-semibold">Hello, {userDetails?.name || 'User'}</p>
              <p className="text-sm text-gray-600">{userDetails?.email}</p>
            </div>
          ) : (
            <Link
              to="/login"
              className="block mb-6 p-3 text-center bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Login / Register
            </Link>
          )}

          {/* Navigation Links */}
          <nav className="space-y-4">
            <Link to="/" className="block py-2 hover:text-orange-500" onClick={() => setIsSideNavOpen(false)}>
              Home
            </Link>
            <Link to="/shop/all/all" className="block py-2 hover:text-orange-500" onClick={() => setIsSideNavOpen(false)}>
              Shop
            </Link>
            {userLoggedIn && (
              <>
                <Link to="/profile" className="block py-2 hover:text-orange-500" onClick={() => setIsSideNavOpen(false)}>
                  Profile
                </Link>
                <Link to="/wishlist" className="block py-2 hover:text-orange-500" onClick={() => setIsSideNavOpen(false)}>
                  Wishlist
                </Link>
              </>
            )}
            <Link to="/about" className="block py-2 hover:text-orange-500" onClick={() => setIsSideNavOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="block py-2 hover:text-orange-500" onClick={() => setIsSideNavOpen(false)}>
              Contact
            </Link>
            {userLoggedIn && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsSideNavOpen(false);
                }}
                className="block w-full text-left py-2 text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSideNavOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[999]"
          onClick={() => setIsSideNavOpen(false)}
        />
      )}
    </div>
  );
};

export default Header;