import About from "@/pages/About";
import AdminLogin from "@/pages/AdminLogin";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import PaymentForm from "@/pages/CheckoutIPG";
import Contact from "@/pages/Contact";
import Error404 from "@/pages/Error404";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import ProductPage from "@/pages/ProductPage";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import SearchPage from "@/pages/Search";
import Shop from "@/pages/Shop";
import SuccessTransactionPage from "@/pages/SuccessTransactionPage";
import AddProduct from "@/pages/Vendordashboard/AddProduct";
import Dashboard from "@/pages/Vendordashboard/Dashboard";
import OrderList from "@/pages/Vendordashboard/OrderList";
import Payments from "@/pages/Vendordashboard/Payments";
import ProductList from "@/pages/Vendordashboard/ProductList";
import Reviews from "@/pages/Vendordashboard/Reviews";
import Settings from "@/pages/Vendordashboard/Settings";
import WishList from "@/pages/Wishlist";

export const userRoutes = [
  {
    name: "home",
    title: "Home",
    component: <Home />,
    path: "/",
  },
  {
    name: "product page",
    title: "Product Page",
    component: <ProductPage />,
    path: "/product/:id",
  },
  {
    name: "about",
    title: "About",
    component: <About />,
    path: "/about",
  },
  {
    name: "cart",
    title: "Cart",
    component: <Cart />,
    path: "/cart",
  },
  {
    name: "contact",
    title: "Contact",
    component: <Contact />,
    path: "/contact",
  },
  {
    name: "profile",
    title: "Profile",
    component: <Profile />,
    path: "/profile",
  },
  {
    name: "checkout",
    title: "Checkout",
    component: <Checkout />,
    path: "/checkout",
  },
  {
    name: "checkoutipg",
    title: "CheckoutIPG",
    component: <PaymentForm />,
    path: "/checkoutipg",
  },
  {
    name: "successfull transaction",
    title: "Successfull Transaction",
    component: <SuccessTransactionPage />,
    path: "/successTransaction",
  },
  {
    name: "wishlist",
    title: "Wishlist",
    component: <WishList />,
    path: "/wishlist",
  },
  {
    name: "search",
    title: "Search",
    component: <SearchPage />,
    path: "/search",
  },
  {
    name: "shop",
    title: "Shop",
    component: <Shop />,
    path: "/shop/:category/:subcategory",
  },
  {
    name: "register",
    title: "Register",
    component: <Register />,
    path: "/register",
  },
  {
    name: "login",
    title: "Login",
    component: <Login />,
    path: "/login",
  },
  {
    name: "forgot-passowrd",
    title: "Forgot Password",
    component: <ForgotPassword />,
    path: "/forgot-password",
  },
  {
    name: "Error 404",
    title: "Error 404",
    component: <Error404 />,
    path: "/*",
  },
];

export const vendorRoutes = [
  {
    name: "dashboard",
    title: "Dashboard",
    component: <Dashboard />,
    path: "/dashboard",
  },
  {
    name: "reviews",
    title: "Reviews",
    component: <Reviews />,
    path: "/dashboard/reviews",
  },
  {
    name: "addProduct",
    title: "Add Product",
    component: <AddProduct />,
    path: "/dashboard/add-product/*",
  },
  {
    name: "orderList",
    title: "Order List",
    component: <OrderList />,
    path: "/dashboard/orders",
  },
  {
    name: "productList",
    title: "Product List",
    component: <ProductList />,
    path: "/dashboard/products",
  },
  {
    name: "payments",
    title: "Payments",
    component: <Payments />,
    path: "/dashboard/payments",
  },
  {
    name: "settings",
    title: "Settings",
    component: <Settings />,
    path: "/dashboard/settings",
  },
];
