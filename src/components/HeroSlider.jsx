import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

export default function HeroSlider({ slider }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the screen width is smaller than 768px
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value based on window size
    handleResize();

    // Add event listener on window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Swiper
      loop={true}
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      navigation={!isMobile} // Only enable navigation if not on mobile
      modules={[Autoplay, Pagination, Navigation]}
      className="w-full h-fit md:h-[500px]"
    >
      {slider.map((slide, index) => {
        return (
          <SwiperSlide key={index}>
            <div className="relative text-white w-full h-full flex flex-col items-center justify-center">
              <a href={slide.link}>
                <img
                  className="w-full h-full object-fill lg:object-cover"
                  src={slide.image}
                  alt={slide.name}
                />
              </a>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
