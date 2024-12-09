"use client";

import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useauth";
import Skeleton from "react-loading-skeleton";
import QRCode from "react-qr-code";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

// Type Definitions
type Discount = {
  companyname: string;
  imageurl: string;
  discountpercentage: number;
  discountpara: string;
}

type UserData = {
  name: string;
  college: string;
  phone: string;
}

const Page: React.FC = () => {
  const [loading2, setLoading2] = useState(true);
  const [data, setData] = useState<Discount[]>([]);
  const [data2, setData2] = useState<UserData | null>(null);
  const [selected, setSelected] = useState<string>("Select the brand");
  const [selectedDetails, setSelectedDetails] = useState<Discount | null>(null);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [qrCodeData, setQRCodeData] = useState<string>("");
  const { user, loading } = useAuth();
  const router = useRouter();

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
    if (!loading && !user) {
      router.push("/joinus");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchData = async () => {
      const urls = [
        "https://api.studentdiscountteam.workers.dev/discounts",
        `https://student-discount.fk4460467.workers.dev/api/users/${user.uid}`,
      ];

      try {
        const [response1, response2] = await Promise.all(
          urls.map((url) =>
            fetch(url).then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch data from ${url}`);
              }
              return response.json();
            })
          )
        );

        const discount: any = response1;
        const userData: any = response2;

        setData(discount);
        setData2(userData);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading2(false);
      }
    };

    fetchData();
  }, [user]);

  const generateRandomQRData = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const handleSelectBrand = (brand: string) => {
    setSelected(brand);
    const brandDetails = data.find((item) => item.companyname === brand) || null;
    setSelectedDetails(brandDetails);
    setShowQR(false);
  };

  const handleGenerateQRCode = async () => {
    const randomQR = generateRandomQRData();
    setQRCodeData(randomQR);
    setShowQR(true);

    try {
      const response = await fetch(
        "https://student-discount.fk4460467.workers.dev/api/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Uid: user?.uid,
            email: user?.email,
            qrCode: randomQR,
            brand: selected,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to push data to server");
      }
      console.log("QR code data successfully sent to the server!");
    } catch (error) {
      console.error("Error pushing QR code data:", error);
    }
  };

  if (loading) {
    return (
      <div className="z-20 w-full h-full flex justify-center items-center mt-56">
        <img src="loading.svg" className="size-20" alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="p-4 mt-16 xl:mx-36">
      <section className="flex flex-col border-2 p-4 mb-8 rounded-lg shadow-md">
        <p className="font-semibold flex justify-between text-sm xl:text-lg">
          <h1 className="text-purple-500 ">Name:</h1> {data2?.name || "N/A"}
        </p>
        <p className="font-semibold flex justify-between text-sm xl:text-lg">
          <h1 className="text-purple-500 text-sm xl:text-lg">College:</h1> {data2?.college || "N/A"}
        </p>
        <p className="font-semibold flex justify-between text-sm xl:text-lg">
          <h1 className="text-purple-500">Email:</h1> {user?.email || "N/A"}
        </p>
        <p className="font-semibold flex justify-between text-sm xl:text-lg">
          <h1 className="text-purple-500">Phone No:</h1> {data2?.phone || "N/A"}
        </p>
      </section>

      <section className="flex justify-center mb-10">
        <Menu as="div" className="relative inline-block">
          <MenuButton className="font-semibold inline-flex items-center gap-x-2 rounded-md bg-white px-4 py-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            {selected}
            <ChevronDownIcon aria-hidden="true" className="w-5 h-5 text-gray-400" />
          </MenuButton>
          <MenuItems className="absolute z-10 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black/5">
            {data.map((item) => (
              <MenuItem key={item.companyname}>
                <button
                  onClick={() => handleSelectBrand(item.companyname)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  {item.companyname}
                </button>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </section>

      {selectedDetails && !showQR && !loading2 ? (
        <section className="border rounded-lg p-6 shadow-lg xl:w-full">
          <img
            src={selectedDetails.imageurl}
            alt={selectedDetails.companyname}
            className="h-48 w-full object-cover rounded-lg mb-4 xl:h-96 xl:object-contain"
          />
          <h1 className="text-2xl font-bold mb-2 xl:flex xl:justify-center">{selectedDetails.companyname}</h1>
          <p className="text-lg mb-2 text-green-500 xl:flex xl:justify-center">
            Discount: {selectedDetails.discountpercentage}%
          </p>
          <p className="text-md mb-4 xl:flex xl:justify-center">{selectedDetails.discountpara}</p>
          <div className="xl:w-full xl:flex xl:justify-center">
            <button
              onClick={handleGenerateQRCode}
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Generate QR Code
            </button>
          </div>
        </section>
      ) : (
        <Skeleton height={400} count={1} />
      )}

      {showQR && (
        <div className="flex flex-col items-center mt-10">
          <QRCode value={qrCodeData} size={256} />
          <p className="font-semibold text-lg text-center text-orange-500 mt-4">
            Use this QR code for verification
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
