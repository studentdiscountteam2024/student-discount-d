"use client";
import Image from "next/image";
import Swiper from "./components/swiper";
import Link from "next/link";
import SwiperB from "./components/swiperbrands";
import { useState, useEffect } from "react";

// Define the type for the brand data
interface BrandItem {
  
}

export const runtime = "edge";

export default function Home() {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.studentdiscountteam.workers.dev/data/banner", { method: "GET" });
        const result: BrandItem[] = await response.json(); // Ensure type safety for the API response
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="xl:mx-10">
      <Swiper />   
        <SwiperB />
        <div className="brands">
        <div className="flex justify-between mx-4">
          <p className="font-bold text-xl">Explore more</p>
        </div>
      </div>

      <div className="body flex flex-wrap justify-between space-y-10 xl:space-y-1 gap-6 mx-4 mt-10">
        {data.map((item:any, index:number) => (
          <div key={index} className="">
            <div className="rounded-2xl bg-white w-[90vw] xl:w-[40vw] shadow-lg">
              <img
                src={item.imgurl}
                className="rounded-t-2xl w-[90vw] h-full object-cover xl:w-[40vw] "
                alt={item.text || "Brand image"} 
              />
              <div className="flex justify-center w-full h-fit">
                <Link href={"/checkout"}>
                  <button className="rounded-full  text-blue-500  h-[5vh] w-[23vw] xl:w-[11vw] p-1 font-semibold  text-sm">
                    Get Offer
                  </button>
                </Link>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
