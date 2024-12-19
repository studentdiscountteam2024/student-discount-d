
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const runtime = "edge";

interface BrandItem {
  brandname: string;
  imgurl: string;
}

const Page: React.FC = () => {
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const [data, setData] = useState<BrandItem[]>([]);
  const { slug } = useParams();
  const [similarProducts, setSimilarProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    setSimilarProducts(shuffleArray([...similarProducts]));
  }, [!loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bannerResponse = await fetch(
          "https://api.studentdiscountteam.workers.dev/data/banner",
          { method: "GET" }
        );
        const bannerResult: BrandItem[] = await bannerResponse.json();
        setData(bannerResult);

        const similarResponse = await fetch(
          "https://api.studentdiscountteam.workers.dev/api/automatic",
          { method: "GET" }
        );
        const similarResult: any = await similarResponse.json();
        setSimilarProducts(similarResult);
        console.log(similarResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mainBrand = data.find(
    (item) =>
      typeof item.brandname === "string" &&
      typeof slug === "string" &&
      item.brandname.includes(slug)
  );

  const displayedProducts = showAll
    ? similarProducts
    : similarProducts.slice(0, 6);

  const handleShowMore = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <div className="xl:mx-10">
      {/* Main Banner Section */}
      <div className="mbanner rounded-xl shadow-xl overflow-hidden mx-4 mt-16 xl:ml-64 xl:flex-col xl:w-[60vw] xl:justify-center">
        {mainBrand && (
          <>
            <img
              src={mainBrand.imgurl}
              alt={mainBrand.brandname}
              className="bg-contain object-cover w-full h-auto xl:h-[30vh] xl:w-full xl:object-contain rounded-xl mt-6"
            />
            <div className="flex justify-center w-full h-fit">
              <Link href={"/checkout"}>
                <button className=" h-[5vh] w-[43vw] xl:w-[11vw] py-2 font-semibold rounded-full text-blue-500 text-sm">
                  Avail Discount
                </button>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Similar Products Section */}
      <p className="font-semibold m-4 text-xl mt-16">
        Similar Products Like{" "}
        <span className="text-[#ff820d]">{slug}</span>
      </p>
      <div className="body flex flex-wrap mb-10 justify-between space-y-10 xl:space-y-1 gap-6 mx-4 mt-10">
        {displayedProducts.map((item: any, index: number) => (
          <div key={index} className="rounded-2xl bg-white shadow-lg">
            <img
              src={item.BrandURL}
              alt={item.BrandName}
              className="rounded-t-2xl w-[90vw] h-[40vh] object-cover xl:w-[40vw] xl:h-[55vh]"
            />
            <div className="p-2 text-center">
              <h3 className="text-lg font-semibold">{item.ProductName}</h3>
            </div>
            <div className="flex justify-center">
              <Link href={"/checkout"}>
                <button className="rounded-full text-blue-500 text-sm  h-[5vh] w-[23vw] xl:w-[11vw] p-1 font-semibold">
                  Get Offer
                </button>
              </Link>
            </div>
          </div>
          
        ))}
        {!loading && (
          <div className="w-full flex justify-center  mt-4">
            <button
              onClick={handleShowMore}
              className="underline"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>

      {/* Show More Button */}
     

      {/* Loading Skeleton */}
      {loading && (
        <Skeleton count={3} height={150} width={300} className="mt-10 ml-4" />
      )}
    </div>
    
  );
};

export default Page;
