import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const CardList = [
  {
    id: 1,
    img: "/Images/b2.png",
    heading: "OUR VISSION",
    content: `At PAELESS, we challenge the idea that style and comfort are mutually exclusive. Our vision is to offer high-quality footwear and clothing that balance comfort, durability, and style—without breaking the budget. We believe in providing products that enhance your everyday life by combining practical comfort with timeless design. Our goal is to make luxury and ease accessible to all, creating a world where style meets reliability in perfect harmony.`,
  },
  {
    id: 2,
    img: "/Images/b3.png",
    heading: "OUR MISSION",
    content: `At PAELESS, our mission is to break the misconception that comfort and style cannot coexist. We aim to provide high-quality, affordable footwear and clothing that deliver both comfort and elegance. By focusing on durability, reliability, and thoughtful design, we strive to offer products that enhance your lifestyle without compromise. We believe in creating a seamless balance between form and function, ensuring that every item we produce serves not only to look good but also to feel good, empowering you to move through life with ease and confidence.`,
  },
  {
    id: 3,
    img: "/Images/b4.png",
    heading: "OUR GOAL",
    content: `At PAELESS, our goal is to redefine the relationship between style, comfort, and affordability. We aim to dispel the misconception that comfort must come at the cost of fashion, and that quality requires a high price. Our mission is to provide footwear and clothing that are as practical as they are stylish—crafted to support, enhance, and elevate your everyday life. We strive to deliver products that combine durability with elegance, ensuring that every piece offers lasting comfort and value, allowing you to live fully and move freely.`,
  },
];

const FeatureList = [
  {
    id: 1,
    heading: "FAST DELIVERY",
    content:
      "We ensure your order is processed and shipped promptly to provide a seamless shopping experience.",
  },
  {
    id: 2,
    heading: "SECURE PAYMENT",
    content: `Our platform uses advanced security measures to safeguard your payment information and ensure safe transactions.`,
  },
  {
    id: 3,
    heading: "EASY ORDER TRACKING",
    content: `Stay updated with real-time tracking of your order from the moment it is dispatched until it reaches your doorstep.`,
  },
  {
    id: 4,
    heading: "24/7 SUPPORT",
    content: `Our dedicated support team is available around the clock to assist with any questions or concerns.`,
  },
  {
    id: 5,
    heading: "QUALITY PRODUCT",
    content: `We prioritize offering high-quality, durable products that meet your expectations and enhance your experience.`,
  },
  {
    id: 6,
    heading: "MONEY BACK GUARANTEE",
    content: `We offer a hassle-free return and refund policy to ensure your satisfaction with every purchase.`,
  },
  {
    id: 7,
    heading: "FREE RETURN",
    content: `Enjoy free returns within the specified period for eligible items, making your shopping experience worry-free.`,
  },
];

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className=" dark:text-gray-400 ">
      <div className=" px-[4%] md:px-[8%] py-3.5 md:py-7 bg-[#F4F5F7]   dark:bg-black dark:text-gray-400 dark:border-b dark:border-t dark:border-gray-600   flex items-center justify-between ">
        <h2 className=" uppercase text-[17px] md:text-[24px] font-[700] plus-jakarta text-[#212121]  dark:text-gray-400  ">
          About Us
        </h2>
        <div className=" flex items-center font-[500] text-[12px] md:text-[13.6px] ">
          <Link to="/">
            <span className=" uppercase text-[#FF7004] cursor-pointer ">
              Home
            </span>
          </Link>
          <span className=" px-1 ">/</span>
          <span className=" uppercase">About Us</span>
        </div>
      </div>

      <section className=" px-[4%] md:px-[8%] mt-4 md:mt-14 ">
        <div className=" flex flex-col md:flex-row gap-3 md:gap-10 mb-8 md:mb-12 ">
          {/* <img
            className=" w-full h-[230px] md:h-[390px]  2xl:w-[855px] object-cover "
            src="/Images/b1.png"
            alt="ab1"
          /> */}
          <div className=" flex flex-col">
            <h3 className=" text-[20px] md:text-[26px] uppercase text-[#363F4D]  dark:text-gray-400  font-[700] plus-jakarta ">
              WELCOME TO{" "}
              <span className=" text-[#FF7004]">PAELESS.</span>
            </h3>
            <p className=" text-[12.5px] md:text-[13.6px] font-[400] md:w-[65%] text-justify mt-2 md:mt-4 mb-5 md:mb-8 text-[#7A7A7A] dark:text-gray-600">
              PAELESS provides a thorough understanding of how the idea of blending style with comfort and affordability came to be. By focusing on high-quality footwear and clothing, PAELESS has built a reputation for offering products that meet the needs of every customer. Their approach is grounded in the belief that fashion should never sacrifice comfort, and comfort should never come at the cost of style. PAELESS ensures that every item they offer is crafted with care, using premium materials that promise durability, support, and all-day wearability. Whether you're looking for everyday footwear or clothing that suits your lifestyle, PAELESS delivers dependable, stylish solutions that don't break the bank. Their system revolves around providing an exceptional balance of quality, comfort, and value, making them the trusted brand for those who seek both practicality and style in every step they take.
            </p>
            <h3 className=" text-[17px] md:text-[21px] uppercase text-[#363F4D]  dark:text-gray-400  font-[700] plus-jakarta ">
              WIN BEST ONLINE SHOP AT 2024
            </h3>
            <p className=" text-[12.5px] md:text-[13.6px] font-[400] md:w-[65%] mt-2 md:mt-4 text-justify text-[#7A7A7A] dark:text-gray-600">
              PAELESS offers a deep insight into how the idea of merging style, comfort, and affordability in fashion first came to life. They provide a comprehensive look at the philosophy that drives their product range, showcasing how this vision transforms everyday clothing and footwear into an experience of both practicality and elegance. PAELESS unveils the true essence of crafting products that not only look good but also feel good, supporting your every movement with the comfort you deserve. In this account, they explore the perfect balance between timeless design and modern sensibility, placing emphasis on reliability and durability without compromising on style. PAELESS invites you to discover the essence of what it means to live well, dressed well, and move through life with ease, offering you more than just products, but a philosophy that blends quality, comfort, and a thoughtful approach to fashion.
            </p>
          </div>
        </div>

        <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mb:-12 ">
          {CardList.map((card, index) => {
            return (
              <div key={index}>
                {/* <img
                  className=" w-full h-[200px] md:h-[300px] object-cover "
                  src={card.img}
                  alt="card-img"
                /> */}
                <div className=" mt-4 md:mt-10">
                  <h4 className=" text-[17px] md:text-[20px] font-[700] plus-jakarta text-[#363F4D]  dark:text-gray-400  md:mb-2 ">
                    {card.heading}
                  </h4>
                  <p className=" text-[12.7px] md:text-[13.6px]   text-[#6c6c6c]">
                    {card.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className=" flex flex-col ">
          <h3 className=" text-[17px] md:text-[20px] uppercase text-[#363F4D]  dark:text-gray-400  font-[700] plus-jakarta ">
            YOU CAN CHOOSE US BECAUSE
            <br />
            WE ALWAYS PROVIDE IMPORTANCE...
          </h3>
          <p className=" text-[12.7px] md:text-[13.6px] font-[400] md:w-[45%] text-justify mt-2 md:mt-4 mb-4 md:mb-8 text-[#7A7A7A] dark:text-gray-600">
            We prioritize our customers by offering reliable shipping, secure payments, easy returns, and a 24/7 support system.
            At our core, we ensure transparency, efficiency, and high-quality service with every interaction,
            making your satisfaction our top priority.
          </p>
        </div>

        <div className=" flex flex-col-reverse md:flex-row gap-1 mb-7 md:mb-12 ">
          <div className=" grid grid-cols-2 gap-x-6 md:gap-0 ">
            {FeatureList.map((item, index) => {
              return (
                <div className=" flex flex-col mb-2 md:mb-5 " key={index}>
                  <h3 className=" text-[15px] md:text-[17px] uppercase text-[#363F4D]  dark:text-gray-400  font-[700] plus-jakarta ">
                    {item.heading}
                  </h3>
                  <p className=" text-[12.1px] md:text-[13.3px] font-[400] md:w-[65%] text-justify text-[#6c6c6c]">
                    {item.content}
                  </p>
                </div>
              );
            })}
          </div>
          {/* <img
            className=" mb-2 md:mb-0 h-[210px] 2xl:h-[288px] object-cover "
            src="/Images/b5.png"
            alt="ab1"
          /> */}
        </div>
      </section>
    </div>
  );
};

export default About;
