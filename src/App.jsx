import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import Newsletter from "./components/Newsletter";
import DialogBar from "./components/Dialog";
import MobileCart from "./components/MobileCart";
import MobileShopFilter from "./components/Dialog copy";
import { AppProvider } from "./context/AppContext";
import { DashboardAppProvider } from "./context/DashboardContext";
import DashboardHeader from "./components/DashboardHeader";
import VendorDialog from "./components/VendorDialog";
import { ToastContainer } from "react-toastify";
import { AdminDashboard } from "./layouts";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { MainAppContext } from "./context/MainContext";
import { userRoutes, vendorRoutes } from "./routes/Route";
import Smv from "./pages/Spin";
import Orders from "./pages/dashboard/Orders";
import Vendors from "./pages/dashboard/Vendors";
import "@google/model-viewer/dist/model-viewer.min.js";
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also import AOS styles
import { gsap } from 'gsap';
import ShippingPolicy from './pages/policies/ShippingPolicy';
import ExchangePolicy from './pages/policies/ExchangePolicy';
import TermsAndConditions from './pages/policies/TermsAndConditions';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import ScrollToTop from "./components/ScrollToTop";

AOS.init();

const App = () => {
  const { userData } = useState({});
  axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
  const { isDarkMode } = useContext(MainAppContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <AppProvider>
      <Header />
      <ScrollToTop/>
      <ToastContainer/>
      <Routes>
        {userRoutes.map((item, index) => {
          return (
            <Route
              key={index}
              path={item.path}
              element={
                <>
                  {item.component}
                  {/* <Newsletter /> */}
                  <DialogBar />
                  <MobileCart userData={userData} />
                  <MobileShopFilter />
                </>
              }
            />
          );
        })}
        <Route path="/spin" element={<Smv />} />
        <Route path="/admindashboard/*" element={<AdminDashboard />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/exchange-policy" element={<ExchangePolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>

      <Footer />
    </AppProvider>
  );
};

export default App;
