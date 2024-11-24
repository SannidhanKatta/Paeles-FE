import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MainAppContext } from "@/context/MainContext";

const Banner = () => {
  const [bannerNumber, setBannerNumber] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");
  const [bannerButtonContent, setBannerButtonContent] = useState("");
  const [slideNumber, setSlideNumber] = useState("slide1");
  const [slideFile, setSlideFile] = useState(null);
  const [slideLink, setSlideLink] = useState("");
  const [slideTitle, setSlideTitle] = useState("");
  const [slideDescription, setSlideDescription] = useState("");
  const [slideButtonContent, setSlideButtonContent] = useState("");
  const [catalogueImage, setCatalogueImage] = useState(null);
  const [catalogueLinks, setCatalogueLinks] = useState(["", "", ""]);
  const [partnerName, setPartnerName] = useState("");
  const [partnerLogo, setPartnerLogo] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [catalogue, setCatalogue] = useState({});
  const [banners, setBanners] = useState([]);
  const [partners, setPartners] = useState([]);
  const isMounted = useRef(false);
  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    if (
      !isMounted.current &&
      (!user || user?.role !== "admin") &&
      (!user1 || user1?.role !== "admin")
    ) {
      navigate("/login");
    } else {
      isMounted.current = true;
      getSliders();
      getCatalogue();
      getAllBanners();
      getPartners();
    }
  }, []);

  const handleLinkChange = (index, value) => {
    const updatedLinks = [...catalogueLinks];
    updatedLinks[index] = value;
    setCatalogueLinks(updatedLinks);
  };

  const handleBannerUpload = async () => {
    const formData = new FormData();
    formData.append("banner", bannerFile);
    formData.append("fileName", bannerNumber);
    formData.append("redirectUrl", bannerLink);
    formData.append("title", bannerTitle);
    formData.append("description", bannerDescription);
    formData.append("buttonContent", bannerButtonContent);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/admin/uploadBanner`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      getAllBanners();
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error("Error uploading banner");
    }
  };

  const handleCatalogueUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("catalogueImage", catalogueImage);
      formData.append("links", JSON.stringify(catalogueLinks));

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/catalogue`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      getCatalogue(); // Fetch catalogue again to update the UI
    } catch (error) {
      console.error("Error updating catalogue:", error);
      toast.error("Error updating catalogue");
    }
  };

  const handleAddPartner = async () => {
    try {
      const formData = new FormData();
      formData.append("partnerLogo", partnerLogo);
      formData.append("partnerName", partnerName);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/partners`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      getPartners(); // Fetch partners again to update the UI
    } catch (error) {
      console.error("Error uploading partner:", error);
      toast.error("Error uploading partner");
    }
  };

  const handleAddSlider = async () => {
    try {
      const formData = new FormData();
      formData.append("name", slideNumber);
      formData.append("sliderImage", slideFile);
      formData.append("link", slideLink);
      console.log(slideFile)
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      // formData.append("title", slideTitle);
      // formData.append("description", slideDescription);
      // formData.append("buttonContent", slideButtonContent);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/slider`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      toast.success(response.data.message);
      getSliders(); // Fetch sliders again to update the UI
    } catch (error) {
      console.error("Error adding slider:", error);
      toast.error("Error adding slider");
    }
  };

  const getSliders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/slider`
      );
      console.log(response.data);
      setSliders(response.data);
    } catch (error) {
      console.error("Error fetching slider:", error);
    }
  };

  const getCatalogue = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/catalogue`
      );
      setCatalogue(response.data.catalogue);
    } catch (error) {
      console.error("Error fetching catalogue:", error);
    }
  };

  const getAllBanners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/banner`
      );
      console.log(response.data.banners);
      setBanners(response.data.banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const getPartners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/partners`
      );
      console.log(response.data);
      setPartners(response.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const handleDeleteSlider = async (sliderId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/slider/${sliderId}`
      );
      toast.success(response.data.message);
      setSliders(sliders.filter((slider) => slider._id !== sliderId));
    } catch (error) {
      console.error("Error deleting slider:", error);
      toast.error("Error deleting slider");
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/admin/banner/${bannerId}`
      );
      toast.success(response.data.message);
      // Filter out the deleted banner from the state
      setBanners(banners.filter((banner) => banner._id !== bannerId));
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Error deleting banner");
    }
  };

  const handleDeleteCatalogue = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/catalogue`
      );
      toast.success(response.data.message);
      setCatalogue({});
    } catch (error) {
      console.error("Error deleting catalogue:", error);
      toast.error("Error deleting catalogue");
    }
  };

  const handleDeletePartner = async (partnerId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/partners/${partnerId}`
      );
      toast.success(response.data.message);
      setPartners(partners.filter((partner) => partner._id !== partnerId));
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error("Error deleting partner");
    }
  };

  return (
    <div className="w-full min-h-[100vh] h-fit bg-[#F8F9FA] dark:bg-black rounded-lg px-[2%] py-4 md:py-10">
      <p className="dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px] ">
        Home Image Slider
      </p>

      <div className="flex flex-col items-center mt-3 md:mt-7 overflow-x-auto rounded-md dark:bg-white/10 bg-white p-3 md:p-5 ">
        <div className="p-6 md:w-[55%] flex-col flex gap-3 pb-8 border-b border-gray-400">
          <label className="text-sm mt-3" htmlFor="slideNumber">
            Slide Number
          </label>
          <input
            name="slideNumber"
            id="slideNumber"
            type="text"
            value={slideNumber}
            onChange={(e) => setSlideNumber(e.target.value)}
            placeholder="Slide Number e.g. 1, 2, 3"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
          <label className="capitalize text-sm mt-3" htmlFor="slideLink">
            Slide No. {slideNumber} Link
          </label>
          <input
            name="slideLink"
            id="slideLink"
            type="link"
            value={slideLink}
            onChange={(e) => setSlideLink(e.target.value)}
            placeholder="Enter link of slide to redirect"
            className="bg-gray-200 text-black placeholder:text-gray-600 rounded-sm p-3"
          />
          <label className="capitalize text-sm" htmlFor="slideImg">
            Add Slide No. {slideNumber} Image
          </label>
          <input
            name="slideImg"
            id="slideImg"
            type="file"
            onChange={(e) => setSlideFile(e.target.files[0])}
          />
        </div>
        <button
          className="bg-orange-400 mt-4 w-full md:w-[55%] text-black hover:bg-orange-500 font-semibold text-sm w- py-3"
          onClick={handleAddSlider}
        >
          Add Slider
        </button>
      </div>

      <div className="mt-6">
        {sliders.length > 0 && (
          <>
            <h3 className="dark:text-gray-400 text-[#363F4D] font-bold text-lg">
              Uploaded Sliders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {sliders.map((slider) => (
                <div key={slider._id} className="relative">
                  <button
                    className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white dark:bg-black dark:bg-opacity-50 text-red-500 hover:bg-red-500 hover:text-white transition duration-300"
                    onClick={() => handleDeleteSlider(slider._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <img
                    src={`${slider.image}`}
                    alt={slider.name}
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <p className="absolute bottom-2 left-2 bg-white bg-opacity-50 px-2 py-1 rounded-md text-sm font-semibold">
                    {slider.name}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>


    </div>
  );
};

export default Banner;
