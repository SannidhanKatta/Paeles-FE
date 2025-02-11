import React, { useContext, useEffect, useRef, useState } from "react";
import { DashboardAppContext } from "../../context/DashboardContext";
import { CurrencyList } from "../../utilities/Currency";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { IoAddCircle, IoAddCircleOutline } from "react-icons/io5";
import { RiSubtractLine } from "react-icons/ri";
import { MainAppContext } from "@/context/MainContext";
import { useNavigate } from "react-router-dom";
import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["JPEG", "PNG", "GIF", "JPG"];
import { FiUpload } from "react-icons/fi"; // Assuming you're using react-icons for icons
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ChangingProgressProvider from "@/components/ChangingProgressProvider";

const AddProduct = () => {
  const [textValue, settextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [attributes, setAttributes] = useState([]);
  // const [attrDialog, setAttrDialog] = useState(-1);
  // const [currAttribute, setCurrAttribute] = useState("");
  // const [newAttributes, setNewAttributes] = useState([]);
  const [file, setFile] = useState([]);
  const [file2, setFile2] = useState([]);
  const [categories, setCategories] = useState([]);
  // const [materials, setMaterials] = useState([]);
  const [percentage, setPercentage] = useState(0);
  const isMounted = useRef(false);

  const handleChange = (file) => {
    console.log(file);
    const additionalImagesArray = Array.from(file);
    setFile(additionalImagesArray);
    setProductDetails({
      ...productDetails,
      additionalImages: additionalImagesArray,
    });
  };
  const handleChange2 = (file) => {
    console.log(file);
    const mainImageFile = file[0];
    setFile2([mainImageFile]);
    setProductDetails({ ...productDetails, mainImage: mainImageFile });
  };
  // const handleUploadARFile = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setProductDetails((prevDetails) => ({
  //       ...prevDetails,
  //       arFile: file,
  //     }));
  //   }
  // };
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
    }
    getCategoriesData();
    getMaterials();
  }, []);

  const [productDetails, setProductDetails] = useState({
    title: "",
    description: "",
    discounts: false,
    discountValue: 0,
    price: "",
    currency: "₹",
    available: "",
    // pieces: "",
    promotional: "New",
    editorContent: "",
    // width: "",
    // height: "",
    // weight: "",
    status: "available",
    // sku: "",
    // metaTitle: "",
    // metaDescription: "",
    // metaTags: "",
    // attributes: attributes?.filter((i) => {
    //   return i?.value !== "" && i?.type !== "";
    // }),
    mainImage: "",
    additionalImages: "",
    threeDiaLinkHor: "",
    threeDiaLinkVer: "",
    arFile: "",
    mainCategory: "",
    subCategory: "",
    // series: [],
    // tags: "",
  });

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "color",
    "clean",
  ];

  // const handleAddAttribute = () => {
  //   setAttributes([
  //     ...attributes,
  //     { type: attrDialog, value: "", price: "0", attributeImage: "" },
  //   ]);
  // };

  // const handleRemoveAttribute = () => {
  //   if (attributes?.length > 0) {
  //     const newArray = attributes?.slice(0, -1);
  //     setAttributes(newArray);
  //   } else {
  //     return;
  //   }
  // };

  // const handleAttributeInputChange = (index, fieldName, fieldValue) => {
  //   const updatedAttributes = [...attributes];
  //   if (fieldName === "attributeImage") {
  //     updatedAttributes[index] = {
  //       ...updatedAttributes[index],
  //       attributeImage: fieldValue,
  //     };
  //   } else {
  //     updatedAttributes[index] = {
  //       ...updatedAttributes[index],
  //       [fieldName]: fieldValue,
  //     };
  //   }
  //   setAttributes(updatedAttributes);
  // };
  // const handleAttributeInputChange2 = (
  //   index,
  //   fieldName1,
  //   fieldValue1,
  //   fieldName2,
  //   fieldValue2
  // ) => {
  //   const updatedAttributes = [...attributes];
  //   updatedAttributes[index] = {
  //     ...updatedAttributes[index],
  //     [fieldName1]: fieldValue1,
  //     [fieldName2]: fieldValue2,
  //   };
  //   setAttributes(updatedAttributes);
  // };

  const handleInputChange = (e) => {
    const { name, value, type, checked, selectedOptions } = e.target;

    if (
      name === "mainCategory" ||
      name === "subCategory" ||
      name === "series"
    ) {
      const selectedValues = Array.from(selectedOptions).map(
        (option) => option.value
      );
      setProductDetails({ ...productDetails, [name]: selectedValues });
    } else {
      const inputValue = type === "checkbox" ? checked : value;
      setProductDetails({ ...productDetails, [name]: inputValue });
    }

    console.log(name, value);
  };

  const handleSubmit = () => {
    console.log(productDetails);
    setLoading(true);
    const formData = new FormData();

    // Append product details to FormData
    Object.entries(productDetails).forEach(([key, value]) => {
      if (key === "mainImage" || key === "additionalImages" || key === "arFile") {
        if (Array.isArray(value)) {
          value.forEach((image) => {
            formData.append(key, image);
          });
        } else {
          formData.append(key, value);
        }
      } else {
        formData.append(key, value);
      }
    });

    // Append sizes to FormData
    formData.append("sizes", JSON.stringify(newSizes));
    console.log(newSizes)
    // Append attribute images to FormData
    // attributes.forEach((attribute) => {
    //   if (attribute.attributeImage) {
    //     formData.append(`attributeImages`, attribute.attributeImage);
    //   }
    // });

    if (attributes.length > 0 && attributes[0].type === "") {
      formData.append("attributes", JSON.stringify([]));
    } else {
      attributes.forEach((attribute) => {
        if (
          attribute.attributeImage &&
          typeof attribute.attributeImage === "object"
        ) {
          attribute.attributeImage = attribute.attributeImage.name || "";
        }
      });

      formData.append("attributes", JSON.stringify(attributes));
    }

    // Add featured and isStock as true
    formData.append("approved", true);
    formData.append("isStock", true);

    const vendorId = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))._id
      : null;

    if (vendorId) {
      formData.append("vendorId", vendorId);
    }

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    // Send FormData to backend route /addProduct
    fetch(`${import.meta.env.VITE_SERVER_URL}/product/create`, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error("Error adding product");
        } else {
          toast.success("Product added successfully");
          // Notify the Shop component to refetch products or update state
          // This could be done via a context or a callback function
          // Example: updateProducts(); // Call a function to refetch products
        }
        clearFormEntries();
        setLoading(false);
        navigate("/admindashboard/products");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        toast.error("Error adding product");
      });
  };
  console.log(attributes);
  const clearFormEntries = () => {
    // Reset productDetails to empty values
    const updatedProductDetails = {
      title: "",
      description: "",
      discounts: false,
      discountValue: "",
      price: "",
      currency: "",
      available: "",
      // pieces: "",
      promotional: "",
      editorContent: "",
      // width: "",
      // height: "",
      // weight: "",
      status: "available",
      // sku: "",
      mainImage: [],
      additionalImages: [],
      superCategory: "",
      mainCategory: "",
      subCategory: "",
      // tags: "",
    };

    // Update productDetails state with empty values
    setProductDetails(updatedProductDetails);
  };

  const getCategoriesData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/category`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );
      console.log(response.data.categories);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getMaterials = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/material`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          },
        }
      );
      console.log(response.data);
      setMaterials(response.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  // const mapMaterialsToAttributes = (selectedMaterialId) => {
  //   const selectedMaterial = materials.find((material) => {
  //     console.log(`Checking material ID: ${material._id}`);
  //     return material._id === selectedMaterialId;
  //   });

  //   if (!selectedMaterial) {
  //     console.error(`Material with ID "${selectedMaterialId}" not found`);
  //     return;
  //   }

  //   // Remove all existing material attributes
  //   let updatedAttributes = attributes.filter((attr) => {
  //     if (attr.type === "material") {
  //       console.log(`Removing attribute with type: ${attr.type}`);
  //       return false;
  //     }
  //     return true;
  //   });

  //   // Add the new material's attributes
  //   selectedMaterial.details.forEach((detail) => {
  //     updatedAttributes.push({
  //       type: "material",
  //       value: detail.value,
  //       price: detail.price,
  //       attributeImage: detail.materialImage,
  //     });
  //   });

  //   setAttributes(updatedAttributes);
  // };

  const handleMultiSelectChange = (e, field) => {
    const { options } = e.target;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setProductDetails((prev) => ({
      ...prev,
      [field]: selectedValues,
    }));
  };

  const getFilteredSubCategories = () => {
    if (productDetails.mainCategory.length === 0) return [];

    // Flatten subcategories from all selected main categories
    const subcategories = productDetails.mainCategory.flatMap(
      (mainCategory) => {
        const selectedMainCategory = categories.find(
          (cat) => cat.fileName === mainCategory
        );
        return selectedMainCategory?.subcategories || [];
      }
    );

    // Filter out duplicate entries
    const uniqueSubcategories = [];
    const seen = new Set();
    subcategories.forEach((subCat) => {
      if (!seen.has(subCat.name)) {
        uniqueSubcategories.push(subCat);
        seen.add(subCat.name);
      }
    });

    return uniqueSubcategories;
  };

  const getFilteredSeries = () => {
    if (productDetails.subCategory.length === 0) return [];

    // Flatten series from all selected subcategories
    const series = productDetails.subCategory.flatMap((subCategory) => {
      const selectedSubCategory = categories
        .flatMap((cat) => cat.subcategories)
        .find((subCat) => subCat.name === subCategory);
      return selectedSubCategory ? selectedSubCategory.series : [];
    });

    return series;
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/category`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );
      setCategories(response.data?.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const [newSizes, setNewSizes] = useState([{ size: '', stock: 0 }]);

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...newSizes];
    updatedSizes[index][field] = value;
    setNewSizes(updatedSizes);
  };

  const handleAddSize = () => {
    setNewSizes([...newSizes, { size: '', stock: 0 }]);
  };

  const handleRemoveSize = (index) => {
    const updatedSizes = newSizes.filter((_, i) => i !== index);
    setNewSizes(updatedSizes);
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div style={{ width: "100px", height: "100px" }}>
            <ChangingProgressProvider values={[0, 20, 40, 60, 80, 100]}>
              {(percentage) => (
                <CircularProgressbar
                  value={percentage}
                  text={`${percentage}%`}
                />
              )}
            </ChangingProgressProvider>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className=" w-full min-h-[100vh] h-fit bg-[#F8F9FA]  dark:bg-black px-[1%] py-4 md:py-10"
        >
          <div className="flex items-center justify-between">
            <p className="dark:text-gray-400 text-[#363F4D] font-bold plus-jakarta text-[17px] md:text-[23px] 2xl:text-[25px]">
              Add New Product
            </p>
            <button
              type="submit"
              className="bg-[#FF7004] px-4 py-2.5 my-1 w-fit font-medium text-[11.2px] md:text-[13px] text-white"
            >
              Publish
            </button>
          </div>

          <div className=" md:px-[1%] flex flex-col items-center lg:items-start lg:grid grid-cols-6 md:m-6 mb-14  ">
            <div className="  md:m-0 flex flex-col gap-5 col-span-3 ">
              <div className=" bg-white dark:bg-white/5 rounded-md py-4 ">
                <div className=" flex flex-col ">
                  <h4 className=" px-7 pb-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200  dark:text-gray-400  text-[#363F4D] mb-1.5 ">
                    Basic
                  </h4>

                  <div className=" md:mt-6 px-7 h-fit ">
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400  text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px]"
                        htmlFor="product-title"
                      >
                        Product title
                        <span className=" text-red-500 text-[24px]">*</span>
                      </label>
                      <input
                        required
                        name="title"
                        id="product-title"
                        type="text"
                        className="w-full p-2 dark:bg-white/10 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px]"
                        placeholder="Type here"
                        value={productDetails.title}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className=" md:mt-1 mb-10 px-7 ">
                    <div className=" flex-col flex">
                      <label
                        className="dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px]"
                        htmlFor="description"
                      >
                        Short Description{" "}
                        <span className="text-red-500 text-[24px]">*</span>
                      </label>
                      <ReactQuill
                        className="h-[150px]"
                        theme="snow"
                        value={productDetails.description}
                        formats={formats}
                        onChange={(textValue) =>
                          setProductDetails({
                            ...productDetails,
                            description: textValue,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className=" md:mt-10 px-7 flex items-center gap-2 ">
                    <input
                      name="discounts"
                      id="isDiscounts"
                      type="checkbox"
                      className=" border-[1.4px] border-[#999999] p-2  dark:text-gray-400 text-[#4F5D77] text-[14.4px]"
                      placeholder="isDiscounts"
                      value={productDetails.discounts}
                      onChange={handleInputChange}
                    />
                    <label
                      className="dark:text-gray-400 text-[#363F4D] font-[600] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] ml-2"
                      htmlFor="isDiscounts"
                    >
                      Product Has Discounts
                    </label>
                  </div>
                  {productDetails?.discounts && (
                    <div className="  px-7 flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="Price"
                      >
                        Discount Value
                      </label>
                      <input
                        name="discountValue"
                        id="discountValue"
                        type="number"
                        className=" w-fit p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="eg- 23"
                        value={productDetails?.discountValue}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}

                  <div className=" px-7 sm:grid grid-cols-3 gap-5 xl:gap-[3%] md:mt-1 ">
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] "
                        htmlFor="Price"
                      >
                        Price (INR)
                        <span className=" text-red-500 text-[24px]">*</span>
                      </label>
                      <input
                        required
                        name="price"
                        id="Price"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="Price"
                        value={productDetails.price}
                        onChange={handleInputChange}
                      />
                    </div>
                    {/* <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="currency"
                      >
                        Currency
                        <span className=" text-red-500 text-[24px]"></span>
                      </label>
                      <select
                        name="currency"
                        id="currency"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        value={productDetails.currency}
                        onChange={handleInputChange}
                      >
                        {CurrencyList.map((item, index) => {
                          return (
                            <option
                              className=" text-black  "
                              key={index}
                              value={item.currency.code}
                            >
                              ({item.currency.code})
                            </option>
                          );
                        })}
                      </select>
                    </div> */}
                  </div>

                  <div className=" px-7 sm:grid grid-cols-3 gap-5 xl:gap-[3%] md:mt-6 ">
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="available"
                      >
                        Available
                      </label>
                      <input
                        name="available"
                        id="available"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="Quantity in Stocks"
                        value={productDetails.available}
                        onChange={handleInputChange}
                      />
                    </div>
                    {/* <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="price-per-piece"
                      >
                        Pieces/Set
                      </label>
                      <input
                        name="pieces"
                        id="price-per-piece"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="Quantity for Pieces"
                        value={productDetails.pieces}
                        onChange={handleInputChange}
                      />
                    </div> */}
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="Super Category"
                      >
                        Promotional
                      </label>
                      <select
                        name="promotional"
                        id="promotional"
                        type="number"
                        className="w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        value={productDetails.promotional}
                        onChange={handleInputChange}
                      >
                        <option value="New">New</option>
                        <option value="Discount">Discount</option>
                        <option value="Hot">Hot</option>
                      </select>
                    </div>
                  </div>
                  <div className=" px-7 sm:grid grid-cols-3 gap-5 xl:gap-[3%] md:mt-6 ">
                    {/* <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="metaTitle"
                      >
                        Meta Title
                      </label>
                      <input
                        name="metaTitle"
                        id="metaTitle"
                        type="text"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="Meta Title"
                        value={productDetails.metaTitle}
                        onChange={handleInputChange}
                      />
                    </div> */}
                    {/* <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="metaDescription"
                      >
                        Meta Description
                      </label>
                      <input
                        name="metaDescription"
                        id="metaDescription"
                        type="text"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="Meta Description"
                        value={productDetails.metaDescription}
                        onChange={handleInputChange}
                      />
                    </div> */}
                    {/* <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="metaHead"
                      >
                        Meta Tag
                      </label>
                      <input
                        name="metaTags"
                        id="metaTags"
                        type="text"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="Meta Tags"
                        value={productDetails.metaTags}
                        onChange={handleInputChange}
                      />
                    </div> */}
                  </div>
                  <div className="flex flex-col pb-14 px-7 mt-5 ">
                    <label className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 ">
                      Long Description
                    </label>
                    <ReactQuill
                      className="h-[150px]"
                      theme="snow"
                      value={productDetails.editorContent}
                      formats={formats}
                      onChange={(textValue) =>
                        setProductDetails({
                          ...productDetails,
                          editorContent: textValue,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className=" md:m-0 bg-white dark:bg-white/5 py-4 rounded-md col-span-3 ">
                <div className=" flex flex-col pb-9 ">
                  {/* <h4 className=" px-7 pb-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200  dark:text-gray-400 text-[#363F4D] mb-1.5 ">
                    Dimensions
                  </h4> */}



                  <div className=" px-7 sm:grid grid-cols-3 gap-5 xl:gap-[3%] md:mt-6 ">
                    {/* <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="Weight"
                      >
                        Weight
                      </label>
                      <input
                        name="weight"
                        id="Weight"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="grams"
                        value={productDetails.weight}
                        onChange={handleInputChange}
                      />
                    </div> */}
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="product-status"
                      >
                        Product status
                      </label>
                      <select
                        name="status"
                        id="product-status"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        value={productDetails.status}
                        onChange={handleInputChange}
                      >
                        <option className=" text-black " value="available">
                          Available
                        </option>
                        <option className=" text-black " value="outOfStock">
                          Out of Stock
                        </option>
                      </select>
                    </div>
                    {/* <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="sku"
                      >
                        SKU
                      </label>
                      <input
                        name="sku"
                        id="sku"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="Product SKU"
                        value={productDetails.sku}
                        onChange={handleInputChange}
                      />
                    </div> */}

                    <div className=" border border-gray-200 md:m-0 bg-white dark:bg-white/5 rounded-md col-span-3 ">
                      <h4 className=" p-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200  dark:text-gray-400 text-[#363F4D] mb-1.5 ">
                        Additional Images
                        <span className=" text-red-500 text-[24px]">*</span>
                      </h4>
                      <div className=" flex-col flex items-center justify-center px-5 py-3">
                        {/* <label
                          className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                          htmlFor="additional-image"
                        >
                          <img
                            className=" w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] object-contain"
                            src="/Images/uploadImg.png"
                            alt="upload-img"
                          />
                        </label> */}
                        <div className=" flex flex-col items-center text-sm justify-center relative w-full h-[300px]">
                          <FileUploader
                            multiple
                            handleChange={handleChange}
                            name="file"
                            types={fileTypes}
                            required
                            style={{ height: "500px" }}
                            hoverTitle="Drop Your Product Images here"
                          />
                          <p className=" mt-1 text-gray-700">
                            {file.length > 0
                              ? `File names: ${file.map(f => f.name).join(', ')}`
                              : "no files uploaded yet"}
                          </p>
                          <p className=" text-gray-700">
                            maximum upload size : 256 MB
                          </p>
                        </div>
                      </div>
                      {/* <h4 className=" p-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200  dark:text-gray-400 text-[#363F4D] mb-1.5 ">
                        Add 360 view of Product
                      </h4>
                      <p className=" text-red-400 font-[600] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] ml-5 ">
                        Need Help in creating 360 view of your product ?
                      </p>
                      <p className=" underline text-blue-600  font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] ml-5 mb-6 ">
                        <a
                          href="https://sirv.com/help/articles/manually-create-spin/#:~:text=Manually%20generate%20a%20spin%20file,-On%20this%20page&text=Spin%20files%20are%20automatically%20generated,file%20will%20not%20be%20generated."
                          target="_blank"
                        >
                          Refer: Create Your Product's 360 view easily for free
                        </a>
                      </p>
                      <p className=" text-gray-800 font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] ml-5 ">
                        Add ( .spin ) link of your product
                      </p>
                      <p className=" text-xs sm:text-sm px-5 py-1">
                        Horizontal
                      </p>
                      <div className=" flex-col flex items-center justify-center px-5">
                        <input
                          name="threeDiaLinkHor"
                          type="url"
                          placeholder=" eg - https://demo.sirv.com/example.spin"
                          className=" w-full p-2 bg-gray-200 text-[#2b3548] placeholder:text-gray-600 border border-black  text-[14.4px]"
                          value={productDetails.threeDiaLinkHor}
                          onChange={handleInputChange}
                        />
                      </div>
                      <p className=" text-xs sm:text-sm px-5 py-1">Vertical</p>
                      <div className=" flex-col flex items-center justify-center px-5 pb-5">
                        <input
                          name="threeDiaLinkVer"
                          type="url"
                          placeholder=" eg - https://demo.sirv.com/example.spin"
                          className=" w-full p-2 bg-gray-200 text-[#2b3548] placeholder:text-gray-600 border border-black  text-[14.4px]"
                          value={productDetails.threeDiaLinkVer}
                          onChange={handleInputChange}
                        />
                      </div>
                      <h4 className="p-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200 dark:text-gray-400 text-[#363F4D] mb-1.5">
                        Add Product in GLB or GLTF Format
                      </h4>
                      <input
                        name="threeDiaLinkVer"
                        type="file"
                        className=" w-full p-2 bg-gray-200 text-[#2b3548] placeholder:text-gray-600   text-[14.4px]"
                        onChange={handleUploadARFile}
                      /> */}
                    </div>
                  </div>
                </div>{" "}
              </div>
              <div className=" md:m-0 mt-4 py-5 bg-white dark:bg-white/5 rounded-md col-span-5 ">
                <h4 className=" px-7 pb-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200  dark:text-gray-400 text-[#363F4D] mb-1.5 ">
                  Add Size <span className=" text-red-500 text-[24px]">*</span>
                </h4>
                <div className="flex flex-col">
                  {newSizes.map((size, index) => (
                    <div key={index} className="flex items-center justify-between px-5 py-2 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Size (e.g., S, M, L)"
                        value={size.size}
                        onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                        className="w-1/2 p-2 border border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={size.stock}
                        onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                        className="w-1/4 p-2 border border-gray-300 rounded"
                      />
                      <div className="flex items-center">
                        <button onClick={() => handleAddSize()} className="bg-green-500 text-white px-2 py-1 rounded">+</button>
                        <button onClick={() => handleRemoveSize(index)} className="bg-red-500 text-white px-2 py-1 rounded">-</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className=" w-full px-[2%] sm:px-[8%] flex flex-col justify-between gap-5  sm:m-8 md:m-0 md:mb-14 col-span-3 ">
              <div className=" md:m-0 bg-white dark:bg-white/5 rounded-md col-span-3 ">
                <h4 className=" px-7 py-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200  dark:text-gray-400 text-[#363F4D] mb-1.5 ">
                  Main Image<span className=" text-red-500 text-[24px]">*</span>
                </h4>
                <div className=" flex-col flex items-center text-xs justify-center px-5 py-3">
                  <FileUploader
                    multiple={true}
                    handleChange={handleChange2}
                    name="file"
                    types={fileTypes}
                    required
                    style={{ height: "500px" }}
                    hoverTitle="Drop Your Product Images here"
                  />
                  <p className=" mt-1 text-gray-700">
                    {file2.length > 0
                      ? `File name: ${file2[0].name}`
                      : "no files uploaded yet"}
                  </p>
                  <p className=" text-gray-700">maximum upload size : 256 MB</p>
                </div>
              </div>

              <div className=" md:m-0 mt-4 py-5 bg-white dark:bg-white/5 rounded-md col-span-3 ">
                <h4 className=" px-7 pb-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200  dark:text-gray-400 text-[#363F4D] mb-1.5 ">
                  Categories
                </h4>

                <div className="flex-col flex mt-4 px-7">
                  <label
                    className="dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1"
                    htmlFor="main-Category"
                  >
                    Main Category
                  </label>
                  <select
                    name="mainCategory"
                    id="main-Category"
                    className="w-full p-2 border border-gray-300 dark:border-white/30 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10 rounded-lg"
                    value={productDetails.mainCategory}
                    onChange={(e) => handleMultiSelectChange(e, "mainCategory")}
                  >
                    <option value="">Select Main Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category.fileName}>
                        {category.fileName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-col flex mt-4 px-7">
                  <label
                    className="dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1"
                    htmlFor="sub-Category"
                  >
                    Sub Category
                  </label>
                  <select
                    name="subCategory"
                    id="sub-Category"
                    className="w-full p-2 border border-gray-300 dark:border-white/30 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10 rounded-lg"
                    value={productDetails.subCategory}
                    onChange={(e) => handleMultiSelectChange(e, "subCategory")}
                  >
                    <option
                      value=""
                      className="border-b border-gray-300 dark:border-white/40"
                    >
                      Select Sub Categories
                    </option>
                    {getFilteredSubCategories().map((subcategory, index) => (
                      <option
                        key={index}
                        value={subcategory.name}
                        className="border-b border-gray-300 dark:border-white/40"
                      >
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* <div className="flex-col flex mt-4 px-7">
                  <label
                    className="dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1"
                    htmlFor="series"
                  >
                    Series
                  </label>
                  <select
                    name="series"
                    id="series"
                    multiple
                    className="w-full p-2 border border-gray-300 dark:border-white/30 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10 rounded-lg"
                    value={productDetails.series}
                    onChange={(e) => handleMultiSelectChange(e, "series")}
                  >
                    <option
                      value=""
                      className="border-b border-gray-300 dark:border-white/40"
                    >
                      Select a Series
                    </option>
                    {getFilteredSeries().map((series, index) => (
                      <option
                        key={index}
                        value={series.name}
                        className="border-b border-gray-300 dark:border-white/40"
                      >
                        {series.name}
                      </option>
                    ))}
                  </select>
                </div> */}

                {/* <div className=" md:mt-6 px-7 ">
                  <div className=" flex-col flex">
                    <label
                      className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                      htmlFor="tags"
                    >
                      Tags
                    </label>
                    <input
                      name="tags"
                      id="tags"
                      type="text"
                      className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                      value={productDetails.tags}
                      onChange={handleInputChange}
                    />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddProduct;