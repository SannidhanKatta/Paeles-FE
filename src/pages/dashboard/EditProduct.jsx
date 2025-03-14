import React, { useContext, useEffect, useState } from "react";
import { DashboardAppContext } from "../../context/DashboardContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { IoAddCircle, IoAddCircleOutline, IoClose } from "react-icons/io5";
import { RiSubtractLine } from "react-icons/ri";
import { MainAppContext } from "@/context/MainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["JPEG", "PNG", "JPG"];
import { FiUpload } from "react-icons/fi"; // Assuming you're using react-icons for icons
import { FaChevronDown } from "react-icons/fa";
import ChangingProgressProvider from "@/components/ChangingProgressProvider";
import { CircularProgressbar } from "react-circular-progressbar";

const OrdersData = [
  {
    id: 1,
    reviewId: "257",
    name: "selem",
    product: "Gorton’s Beer Battered Fish Fillets with soft paper",
    date: "March 17, 2024, 5:46 a.m.",
    rating: "5",
  },
];

const EditProduct = ({ product, setIsEditProduct }) => {
  const [textValue, settextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [attrDialog, setAttrDialog] = useState(-1);
  const [currAttribute, setCurrAttribute] = useState("");
  const [newAttributes, setNewAttributes] = useState([
    "color",
    "material",
    "size",
  ]);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const handleChange = (file) => {
    console.log(file);
    const additionalImagesArray = Array.from(file);
    setProductDetails({
      ...productDetails,
      additionalImages: additionalImagesArray,
    });
  };
  const handleChange2 = (file) => {
    console.log(file);
    const mainImageFile = file[0];
    setProductDetails({ ...productDetails, mainImage: mainImageFile });
  };
  const handleUploadARFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        arFile: file,
      }));
    }
  };
  const { user } = useContext(MainAppContext);
  const navigate = useNavigate();
  useEffect(() => {
    const user1 = JSON.parse(localStorage.getItem("user"));
    // if (user?.role !== "admin" && user1?.role !== "admin") {
    //   navigate("/login");
    // }
  }, []);

  const [productDetails, setProductDetails] = useState({
    title: "",
    description: "",
    discounts: false,
    discountValue: 0,
    price: "",
    currency: "INR",
    available: "",
    promotional: "New",
    editorContent: "",
    status: "available",
    attributes: attributes?.filter((i) => {
      return i?.value !== "" && i?.type !== "";
    }),
    mainImage: "",
    additionalImages: "",
    arFile: "",
    mainCategory: [],
    subCategory: [],
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
  useEffect(() => {
    const getProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/product/${product?._id}`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
          }
        );
        console.log(response.data);
        setLoading(false);
        setProductDetails(response.data);
        setAttributes(response.data.attributes);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    const getCategoriesData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/admin/category`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
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

    if (product?._id) {
      getProductDetails();
      getCategoriesData();
      getMaterials();
    }
  }, [product?._id]);

  const handleAddAttribute = () => {
    setAttributes([
      ...attributes,
      { type: attrDialog, value: "", price: "0", attributeImage: "" },
    ]);
  };

  const handleRemoveAttribute = () => {
    if (attributes?.length > 0) {
      const newArray = attributes?.slice(0, -1);
      setAttributes(newArray);
    } else {
      return;
    }
  };

  const handleAttributeInputChange = (index, fieldName, fieldValue) => {
    const updatedAttributes = [...attributes];
    if (fieldName === "attributeImage") {
      updatedAttributes[index] = {
        ...updatedAttributes[index],
        attributeImage: fieldValue,
      };
    } else {
      updatedAttributes[index] = {
        ...updatedAttributes[index],
        [fieldName]: fieldValue,
      };
    }
    console.log(updatedAttributes);
    setAttributes(updatedAttributes);
  };
  const handleAttributeInputChange2 = (
    index,
    fieldName1,
    fieldValue1,
    fieldName2,
    fieldValue2
  ) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [fieldName1]: fieldValue1,
      [fieldName2]: fieldValue2,
    };
    setAttributes(updatedAttributes);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setProductDetails({ ...productDetails, [name]: inputValue });
    console.log(productDetails);
  };

  const handleSubmit = () => {
    setLoading(true);
    console.log(productDetails);
    console.log(attributes);
    const formData = new FormData();
    // Append product details to FormData
    Object.entries(productDetails).forEach(([key, value]) => {
      if (
        key === "mainImage" ||
        key === "additionalImages" ||
        key === "arFile"
      ) {
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

    attributes.forEach((attribute) => {
      if (typeof attribute.attributeImage !== "string") {
        formData.append(`attributeImages`, attribute.attributeImage);
      }
    });

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
    console.log("sizes", newSizes)
    formData.append("sizes", JSON.stringify(newSizes));
    console.log("Formdata", formData)
    // Send FormData to backend route /addProduct
    const productId = productDetails._id;
    fetch(`${import.meta.env.VITE_SERVER_URL}/product/edit/${productId}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error("Error updating product");
        } else toast.success("Product updated successfully");
        setLoading(false);
        navigate("/admindashboard/products")
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        toast.error("Error updating product");
      });
  };

  const clearFormEntries = () => {
    // Reset productDetails to empty values
    const updatedProductDetails = {
      title: "",
      description: "",
      discounts: "",
      discountValue: "",
      price: "",
      currency: "INR",
      available: "",
      promotional: "",
      editorContent: "",
      status: "",
      attributes: [],
      mainImage: [],
      additionalImages: [],
      arFile: "",
      mainCategory: [],
      subCategory: [],
    };

    // Update productDetails state with empty values
    setProductDetails(updatedProductDetails);
  };

  const mapMaterialsToAttributes = (selectedMaterialId) => {
    const selectedMaterial = materials.find((material) => {
      console.log(`Checking material ID: ${material._id}`);
      return material._id === selectedMaterialId;
    });

    if (!selectedMaterial) {
      console.error(`Material with ID "${selectedMaterialId}" not found`);
      return;
    }

    // Remove all existing material attributes
    let updatedAttributes = attributes.filter((attr) => {
      if (attr.type === "material") {
        console.log(`Removing attribute with type: ${attr.type}`);
        return false;
      }
      return true;
    });

    // Add the new material's attributes
    selectedMaterial.details.forEach((detail) => {
      updatedAttributes.push({
        type: "material",
        value: detail.value,
        price: detail.price,
        attributeImage: detail.materialImage,
      });
    });

    setAttributes(updatedAttributes);
  };

  const handleMultiSelectChange = (e, field) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );

    setProductDetails((prevState) => ({
      ...prevState,
      [field]: selectedOptions,
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

  // Initialize newSizes with the sizes from the product prop
  const [newSizes, setNewSizes] = useState(product.sizes || [{ size: '', stock: 0 }]);

  useEffect(() => {
    // Set newSizes when product prop changes
    if (product.sizes) {
      setNewSizes(product.sizes);
    }
  }, [product.sizes]);

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
        <div className=" w-full min-h-[100vh] h-fit bg-[#F8F9FA]  dark:bg-black px-[1%] py-4 md:py-10">
          <div className=" flex items-center justify-between">
            <button
              className="bg-[#FF7004] px-4 py-2.5 my-1 w-fit font-medium text-[11.2px] md:text-[13px] text-white"
              onClick={() => {
                setIsEditProduct(false);
              }}
            >
              Cancel
            </button>
            <button
              className="bg-[#FF7004] px-4 py-2.5 my-1 w-fit font-medium text-[11.2px] md:text-[13px] text-white"
              onClick={handleSubmit}
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
                  {productDetails?.discountValue && (
                    <div className=" md:mt-10 px-7 flex items-center gap-2 ">
                      <input
                        name="discounts"
                        id="isDiscounts"
                        type="checkbox"
                        className=" border-[1.4px] border-[#999999] p-2  dark:text-gray-400 text-[#4F5D77] text-[14.4px]"
                        placeholder="isDiscounts"
                        checked={productDetails?.discountValue}
                        onChange={handleInputChange}
                      />
                      <label
                        className=" dark:text-gray-400 text-[#363F4D] font-[600] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="isDiscounts"
                      >
                        Product Has Discounts
                      </label>
                    </div>
                  )}
                  {productDetails?.discountValue && (
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
                        placeholder="DH"
                        value={productDetails.price}
                        onChange={handleInputChange}
                      />
                    </div>
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
                    <div className=" flex-col flex">
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
                    </div>
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
                </div>
              </div>
              <div className=" md:m-0 bg-white dark:bg-white/5 py-4 rounded-md col-span-3 ">
                <div className=" flex flex-col pb-9 ">
                  {/* <h4 className=" px-7 pb-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200  dark:text-gray-400 text-[#363F4D] mb-1.5 ">
                    Dimensions
                  </h4> */}

                  {/* <div className=" px-7 sm:grid grid-cols-2 gap-5 xl:gap-[3%] md:mt-6 ">
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="Width"
                      >
                        Width
                        <span className=" text-red-500 text-[24px]">*</span>
                      </label>
                      <input
                        required
                        name="width"
                        id="Width"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="inch"
                        value={productDetails.width}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className=" flex-col flex">
                      <label
                        className=" dark:text-gray-400 text-[#4F5D77] font-[700] plus-jakarta text-[12px] md:text-[13px] 2xl:text-[14.4px] mb-1 "
                        htmlFor="Height"
                      >
                        Height
                        <span className=" text-red-500 text-[24px]">*</span>
                      </label>
                      <input
                        required
                        name="height"
                        id="Height"
                        type="number"
                        className=" w-full p-2 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10"
                        placeholder="inch"
                        value={productDetails.height}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div> */}

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
                      {productDetails?.additionalImages ? (
                        <>
                          {productDetails?.additionalImages?.length < 4 ? (
                            <>
                              <div className=" flex flex-col">
                                {productDetails?.additionalImages?.map(
                                  (item, index) => {
                                    return (
                                      <div key={index} className=" relative">
                                        <IoClose
                                          className=" absolute bg-orange-300 text-[24px] right-0 cursor-pointer"
                                          onClick={() => {
                                            const newArr =
                                              productDetails?.additionalImages?.filter(
                                                (i) => {
                                                  return i !== item;
                                                }
                                              );
                                            console.log(newArr);
                                          }}
                                        />
                                        <img
                                          src={item}
                                          alt={item}
                                          className=" w-full h-[300px] object-cover border border-black"
                                        />
                                      </div>
                                    );
                                  }
                                )}
                              </div>
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
                                    multiple={true}
                                    handleChange={handleChange}
                                    name="file"
                                    types={fileTypes}
                                    required
                                    style={{ height: "500px" }}
                                    hoverTitle="Drop Your Product Images here"
                                  />
                                  <p className=" mt-1 text-gray-700">
                                    {file
                                      ? `File name: ${file[0].name}`
                                      : "no files uploaded yet"}
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className=" flex flex-col">
                              {productDetails?.additionalImages?.map(
                                (item, index) => {
                                  return (
                                    <div key={index} className=" relative">
                                      <IoClose
                                        className=" absolute bg-orange-300 text-[24px] right-0 cursor-pointer"
                                        onClick={() => {
                                          const newArr =
                                            productDetails?.additionalImages?.filter(
                                              (i) => {
                                                return i !== item;
                                              }
                                            );
                                          console.log(newArr);
                                        }}
                                      />
                                      <img
                                        src={item}
                                        alt={item}
                                        className=" w-full h-[300px] object-cover border border-black"
                                      />
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </>
                      ) : (
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
                              multiple={true}
                              handleChange={handleChange}
                              name="file"
                              types={fileTypes}
                              required
                              style={{ height: "500px" }}
                              hoverTitle="Drop Your Product Images here"
                            />
                            <p className=" mt-1 text-gray-700">
                              {file
                                ? `File name: ${file[0].name}`
                                : "no files uploaded yet"}
                            </p>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>{" "}
              </div>
              <div className=" md:m-0 mt-4 py-5 bg-white dark:bg-white/5 rounded-md col-span-5 ">
                <h4 className=" px-7 pb-3 text-[16px] md:text-[18px] 2xl:text-[20px] font-[700] plus-jakarta border-b border-gray-200 dark:text-gray-400 text-[#363F4D] mb-1.5 ">
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
                {productDetails?.mainImage ? (
                  <div className=" relative">
                    <IoClose
                      className=" absolute bg-orange-300 text-[24px] right-0 cursor-pointer"
                      onClick={() => {
                        // remove mainimage
                      }}
                    />
                    <img
                      src={productDetails?.mainImage}
                      alt={productDetails?.mainImage}
                      className=" w-full h-[300px] object-cover border border-black"
                    />
                  </div>
                ) : (
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
                      {file
                        ? `File name: ${file[0].name}`
                        : "no files uploaded yet"}
                    </p>
                    <p className=" text-gray-700">
                      maximum upload size : 256 MB
                    </p>
                  </div>
                )}
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
                    multiple
                    className="w-full p-2 border border-gray-300 dark:border-white/30 dark:text-gray-400 text-[#4F5D77] bg-[#f2f2f2] text-[14.4px] dark:bg-white/10 rounded-lg"
                    value={productDetails.mainCategory}
                    onChange={(e) => handleMultiSelectChange(e, "mainCategory")}
                  >
                    <option
                      value=""
                      className="border-b border-gray-300 dark:border-white/40"
                    >
                      Select Main Categories
                    </option>
                    {categories.map((category, index) => (
                      <option
                        key={index}
                        value={category.fileName}
                        className="border-b border-gray-300 dark:border-white/40"
                      >
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
                    multiple
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProduct;
