"use client";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useauth";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";




const OnlineDisc = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading1, setloading1] = useState(true);
  const { user , loading } = useAuth();
  const router = useRouter()

  useEffect(() => {
    const checkuser = async () => {
      if (!user?.email) return;
      const userRef = doc(db, "users", user.email);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        router.push("/joinus");
        return;
      }
    };

    checkuser();
  }, [user, router]);

  useEffect(() => {
    if (!loading1 && !user) {
      router.push("/joinus");
    }
  }, [user, loading1, router]);


  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.studentdiscountteam.workers.dev/data/onlinedisc",
          { method: "GET" }
        );
        const result:any = await response.json();
        setData(result);
        const uniqueCategories: any = Array.from(new Set(result.map((item: any) => item.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setloading1(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = selectedCategory
    ? data.filter((item:any) => item.category === selectedCategory)
    : data.sort(() => Math.random() - 0.5).slice(0, 8);
    if (loading) {
      return (
        <div className="z-20 w-full h-full flex justify-center items-center mt-56">
          <img src="loading.svg" className="size-20" alt="Loading..." />
        </div>
      );
    }
  
  return (
    <div className="px-4">
      {!loading1 && (
        <div>
          <div className="mt-14 fixed top-0 left-0 w-full z-10 bg-transparent ">
            <div className="flex flex-col items-center bg-transparent ">
              <nav className="p-4 xl:w-[80%] shadow-xl bg-white rounded-b-md border z-50 ">
                <ul className="grid grid-cols-3 xl:grid-cols-4 xl:gap-4 gap-2 items-center">
                  {categories.slice(0, 3).map((category, index) => (
                    <li
                      key={index}
                      className={`text-center font-medium cursor-pointer transition duration-300 ${
                        selectedCategory === category
                          ? "text-[#ff820d]"
                          : "text-blue-500"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </li>
                  ))}
                </ul>

                <div
                  className={`transition-all duration-500 overflow-hidden ${
                    expanded ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <ul className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-4 text-blue-500">
                    {categories.slice(3).map((category, index) => (
                      <li
                        key={index}
                        className={`text-center font-medium cursor-pointer transition duration-300 ${
                          selectedCategory === category ? "text-[#ff820d]" : ""
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
              <button
                className="text-[#ff820d] mt-2 text-2xl transition duration-300"
                onClick={toggleExpand}
              >
                {expanded ? "↑" : "↓"}
              </button>
            </div>
          </div>
          {/* Cards Section */}
          <div className="mt-44 grid grid-cols-2  xl:grid-cols-3 gap-6 mb-10">
            {filteredData.map((item:any, index:number) => (
              <div
                key={index}
                className="p-2 xl:p-4  bg-white shadow-lg rounded-lg transition-transform hover:scale-105"
              >
                <img
                  src={item.imgurl || "https://via.placeholder.com/150"}
                  alt={item.Description}
                  className="w-full h-40 xl:h-60 object-cover rounded-md"
                />
                <div className="mt-4 xl:h-[15vh]">
                  <h3 className="text-lg text-center font-semibold truncate">
                    {item.Description}
                  </h3>
                  <p className="text-green-500 text-center mt-2 font-bold">
                    {item.price || "Price not available"}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" text-blue-500 font-semibold px-4 py-2 rounded-md  "
                  >
                    <p className="text-center">Get offer</p>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {loading1 && (
        <div className="flex flex-wrap justify-center gap-12 mt-28">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="w-[80%] sm:w-[300px] xl:w-[250px]">
              <Skeleton height={250} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OnlineDisc;
