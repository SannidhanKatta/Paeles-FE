import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

export default function HeroSlider({ slider }) {
  return (
    <>
      <Swiper
        loop={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className=" w-full h-fit md:h-[500px]  "
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
    </>
  );
}
