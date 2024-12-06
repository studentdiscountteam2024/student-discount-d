"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";

// Define the type for each banner item
interface BannerItem {
  brandname: string;
  imgurl: string;
}

export default function SwiperComponent() {
  const [data, setData] = useState<BannerItem[]>([]); // Typed as an array of BannerItem
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.studentdiscountteam.workers.dev/banner", { method: "GET" })
      .then((response) => response.json())
      .then((data: BannerItem[]) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-auto py-10 z-10 mt-6 xl:flex xl:justify-center">
      <div className="max-w-[90%] mx-4  xl:max-w-[70%] ">
        {loading ? (
          <Skeleton height={200} count={1} />
        ) : (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            loop
          >
            {data.map((item, index) => (
              <SwiperSlide key={index}>
                <Link href={`company/${item.brandname}`}>
                  <div className="mbanner rounded-xl overflow-hidden">
                    <img
                      src={item.imgurl}
                      alt={item.brandname}
                      className="bg-contain object-cover w-full h-auto rounded-t-xl mt-6"
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
}
