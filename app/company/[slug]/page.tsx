"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export const runtime = "edge";

interface BrandItem {
  imgurl: string;
  logo?: string;
  text?: string;
}

const Page: React.FC = () => {
  const [data, setData] = useState<BrandItem[]>([]); // Typed state for better maintainability
  const { slug } = useParams(); // Extract slug from the URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.studentdiscountteam.workers.dev/brands", { method: "GET" });
        const result: BrandItem[] = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="xl:mx-10">
      {/* Main Banner */}
      <div className="mbanner rounded-3xl shadow-xl overflow-hidden mx-4 mt-16 xl:flex xl:justify-center">
        <img
          src={data[0]?.imgurl}
          alt="Main banner"
          className="bg-contain object-cover w-full h-auto xl:h-[60vh] xl:w-[60vw] rounded-3xl mt-6"
        />
        <div className="flex justify-center w-full h-fit">
          <Link href={"/checkout"}>
            <button className="border-blue-600 border-2 m-2 h-[5vh] w-[43vw] xl:w-[11vw] p-1 font-semibold rounded-sm bg-slate-50 text-sm">
              Avail Discount
            </button>
          </Link>
        </div>
      </div>

      {/* Similar Products Section */}
      <p className="font-semibold m-4 text-xl mt-16">Similar Products From {slug}</p>
      <div className="body flex flex-wrap justify-between space-y-10 xl:space-y-1 gap-6 mx-4 mt-10">
        {data.map((item, index) => (
          <div key={index} className="">
            <div className="rounded-2xl bg-white w-[90vw] xl:w-[40vw] shadow-lg">
              <img
                src={item.imgurl}
                alt={`Product ${index + 1}`}
                className="rounded-t-2xl w-full h-full"
              />
              <div className="flex justify-center w-full h-fit">
                <Link href={"/checkout"}>
                  <button className="border-blue-600 border-2 m-2 h-[5vh] w-[23vw] xl:w-[11vw] p-1 font-semibold rounded-sm bg-slate-50 text-sm">
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
