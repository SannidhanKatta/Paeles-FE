import PropTypes from "prop-types";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useEffect, useState } from "react";
import { IoLogOut } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { MobileMenuButton } from "@/routes";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };
  const [activeNav, setActiveNav] = useState("");
  const { setUserLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const path = pathSegments[pathSegments.length - 1];
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setActiveNav(path);
  }, [path]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserLoggedIn(false);
    toast.success("Successfully logged out");
    navigate("/");
  };

  return (
    <>
      <MobileMenuButton
        onClick={() => {
          setIsOpen(!isOpen);
          setOpenSidenav(dispatch, !isOpen);
        }}
        isOpen={isOpen}
      />

      <aside
        onClick={() => {
          if (window.innerWidth < 1140) {
            setOpenSidenav(dispatch, false);
          }
        }}
        className={`
          fixed top-0 left-0 z-40 h-screen 
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
      >
        <div
          className={` ${sidenavTypes[sidenavType]} ${openSidenav ? "translate-x-0" : "-translate-x-80"
            } w-72  rounded-xl my-4 ml-4 h-fit min-h-[calc(100vh-32px)] `}
        >
          <div className={`relative`}>
            <div className="py-3 px-8 ">
              <Typography
                variant="h5"
                className=" pl-4"
                color={sidenavType === "dark" ? "white" : "blue-gray"}
              >
                Admin Dashboard
              </Typography>
            </div>
            <IconButton
              variant="text"
              color="white"
              size="sm"
              ripple={false}
              className="absolute right-1 top-1 grid rounded-br-none rounded-tl-none xl:hidden"
              onClick={() => setOpenSidenav(dispatch, false)}
            >
              <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-black" />
            </IconButton>
          </div>
          <div className="m-4 mt-0">
            {routes.map(({ layout, title, pages }, key) => (
              <ul key={key} className="mb-4 flex flex-col gap-1">
                {title && (
                  <li className="mx-3.5 mt-4 mb-2">
                    <Typography
                      variant="small"
                      color={sidenavType === "dark" ? "white" : "blue-gray"}
                      className="font-black uppercase opacity-75"
                    >
                      {title}
                    </Typography>
                  </li>
                )}
                {pages.map(({ icon, name, path }) => (
                  <li key={name}>
                    <NavLink to={`/admindashboard${path}`}>
                      {({ isActive }) => (
                        <Button
                          onClick={() => {
                            setActiveNav(name);
                            if (window.innerWidth < 1140) {
                              setOpenSidenav(dispatch, false);
                            }
                          }}
                          variant={
                            activeNav.toLowerCase() === name?.toLowerCase()
                              ? "gradient"
                              : "text"
                          }
                          color={
                            activeNav.toLowerCase() === name?.toLowerCase()
                              ? "black"
                              : "blue-gray"
                          }
                          className="flex items-center gap-4 px-4 capitalize"
                          fullWidth
                        >
                          {icon}
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            {name}
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                ))}
                {" "}
                <Button
                  onClick={() => {
                    handleLogout();
                  }}
                  variant={"text"}
                  color={"blue-gray"}
                  className="flex items-center gap-4 px-6 capitalize"
                  fullWidth
                >
                  <IoLogOut className=" text-[22px]" />
                  <Typography color="inherit" className="font-medium capitalize">
                    Logout
                  </Typography>
                </Button>
              </ul>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Material Tailwind React",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default Sidenav;
