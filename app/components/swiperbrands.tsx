"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";

const Page: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.studentdiscountteam.workers.dev/brands", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-auto py-10 z-10 xl:flex xl:justify-center">
      <div className="max-w-[90%] mx-4 xl:w-[70%]">
        {loading ? (
          <Skeleton height={100} count={1} />
        ) : (
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={10} // Space between each logo
            slidesPerView={3} // Show 3 slides at a time
            slidesPerGroup={1} // Scroll one slide at a time
            autoplay={{ delay: 2000, reverseDirection: true }}
            loop
          >
            {data.map((item, index) => (
              <SwiperSlide key={index}>
                <Link href={`company/${item.name}`}>
                  <div className="mbanner rounded-xl overflow-hidden">
                    <img
                      src={item.imgurl}
                      alt="image"
                      className="bg-contain object-cover w-full xl:w-48 h-auto rounded-t-xl mt-6"
                    />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default Page;