"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export const runtime = "edge";

interface BrandItem {
  brandname: string;
  imgurl: string;
}

const Page: React.FC = () => {
  const [data, setData] = useState<BrandItem[]>([]);
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.studentdiscountteam.workers.dev/banner", { method: "GET" });
        const result: BrandItem[] = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const mainBrand = data.find(
    (item) => typeof item.brandname === "string" && typeof slug === "string" && item.brandname.includes(slug)
  );
  
  const similarProducts = data.filter(
    (item) => typeof item.brandname === "string" && typeof slug === "string" && !item.brandname.includes(slug)
  );
  

  return (
    <div className="xl:mx-10">
      {/* Main Banner Section */}
      <div className="mbanner rounded-xl shadow-xl overflow-hidden mx-4 mt-16 xl:ml-64 xl:flex-col xl:w-[60vw] xl:justify-center">
        {mainBrand && (
          <>
            <img
              src={mainBrand.imgurl}
              alt={mainBrand.brandname}
              className="bg-contain object-cover w-full h-auto xl:h-[30vh] xl:w-full xl:object-contain rounded-xl mt-6 "
            />
            <div className="flex justify-center w-full h-fit">
              <Link href={"/checkout"}>
                <button className=" m-2 h-[5vh] w-[43vw] xl:w-[11vw] py-2 font-semibold rounded-full text-blue-500   text-sm">
                  Avail Discount
                </button>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Similar Products Section */}
      <p className="font-semibold m-4 text-xl mt-16">Similar Products Like {slug}</p>
      <div className="body flex flex-wrap mb-10 justify-between space-y-10 xl:space-y-1 gap-6 mx-4 mt-10">
        {similarProducts.map((item, index) => (
          <div key={index} className="">
            <div className="rounded-2xl bg-white w-[90vw] xl:w-[40vw] shadow-lg">
              <img
                src={item.imgurl}
                alt={item.brandname}
                className="rounded-t-2xl w-full h-full "
              />
              <div className="flex justify-center w-full h-fit">
                <Link href={"/checkout"}>
                  <button className="  rounded-full  text-blue-500  text-sm m-2 h-[5vh] w-[23vw] xl:w-[11vw] p-1 font-semibold  ">
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
};

export default Page;
