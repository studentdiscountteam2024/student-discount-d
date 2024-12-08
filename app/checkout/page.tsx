"use client";

import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useauth";
import QRCode from "react-qr-code";

export const runtime = "edge";

interface Product {
  text: string;
  logo: string;
}

interface User {
  name: string;
  college: string;
  email: string;
  phone: string;
}

const Page: React.FC = () => {
  const products: Product[] = [
    { text: "MacBook Pro", logo: "/macbook-pro.png" },
    { text: "iPhone 13", logo: "/iphone-13.png" },
    { text: "AirPods Pro", logo: "/airpods-pro.png" },
    { text: "Apple Watch", logo: "/apple-watch.png" },
  ];

  const [selected, setSelected] = useState<string>("Select the brand");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [showQR, setShowQR] = useState<boolean>(false);
  const [qrCodeData, setQRCodeData] = useState<string>("");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/joinus");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="z-20 w-full h-full flex justify-center items-center mt-56">
        <img src="loading.svg" className="size-20" alt="Loading..." />
      </div>
    );
  }

  const handleIncrement = (productName: string) => {
    setCounts((prev) => ({
      ...prev,
      [productName]: (prev[productName] || 0) + 1,
    }));
  };

  const handleDecrement = (productName: string) => {
    setCounts((prev) => ({
      ...prev,
      [productName]: Math.max((prev[productName] || 0) - 1, 0),
    }));
  };

  const handleCheckout = async () => {
    const checkoutData = {
      user: {
        name: "John Doe",
        college:  "Default College",
        email: user?.email || "example@mail.com",
        phone: "1234567890",
      },
      selectedBrand: selected,
      selectedProducts: Object.entries(counts).map(([product, count]) => ({
        product,
        count,
      })),
    };

    const qrData = JSON.stringify(checkoutData);
    setQRCodeData(qrData);
    setShowQR(true);

    try {
      const response = await fetch(
        "https://student-discount.fk4460467.workers.dev/api/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...checkoutData, qrCode: qrData }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send data to the database");
      }
      console.log("Data successfully sent to the database!");
    } catch (error) {
      console.error("Error sending data to the database:", error);
    }
  };

  if (showQR) {
    return (
      <div className="flex flex-col items-center mt-20 space-y-10">
        <section className="flex flex-col py-8 px-4 mb-5 rounded-sm shadow-xl">
          <p className="font-semibold flex justify-between">
            <h1 className="text-purple-500">Name:</h1> { "John Doe"}
          </p>
          <p className="font-semibold flex justify-between">
            <h1 className="text-purple-500">College:</h1> { "Default College"}
          </p>
          <p className="font-semibold flex justify-between">
            <h1 className="text-purple-500">Email:</h1> {user?.email || "example@mail.com"}
          </p>
          <p className="font-semibold flex justify-between">
            <h1 className="text-purple-500">Phone No:</h1> {"1234567890"}
          </p>
        </section>
        <div className="mb-10">
          <QRCode value={qrCodeData} size={256} />
        </div>
        <p className="font-semibold text-lg text-center text-orange-500">
          Use this QR code for verification
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 mt-16 xl:mx-36">
      <section className="flex flex-col border-2 p-4 mb-8 rounded-lg shadow-md">
        <p className="font-semibold">Name: {user?.email}</p>
        <p className="font-semibold">College: {user?.uid}</p>
        <p className="font-semibold">Email: {user?.email}</p>
        <p className="font-semibold">Phone No: {user?.displayName}</p>
      </section>

      <section className="flex justify-center mb-10">
        <Menu as="div" className="relative inline-block">
          <MenuButton className="font-semibold inline-flex items-center gap-x-2 rounded-md bg-white px-4 py-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            {selected}
            <ChevronDownIcon aria-hidden="true" className="w-5 h-5 text-gray-400" />
          </MenuButton>
          <MenuItems className="absolute z-10 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black/5">
            {[
              "Habitate",
              "Vijay Sales",
              "AudioCup",
              "Bajaj Electronics",
              "Reliance Digital",
            ].map((brand) => (
              <MenuItem key={brand}>
                <button
                  onClick={() => setSelected(brand)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  {brand}
                </button>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </section>

      <section className="grid grid-cols-2 gap-6">
        {products.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center border rounded-lg shadow-md p-4 bg-white"
          >
            <img
              src={item.logo}
              alt={item.text}
              className="h-32 w-32 object-contain rounded-md mb-4"
            />
            <p className="font-bold text-lg text-center mb-4">{item.text}</p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleDecrement(item.text)}
                className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300"
              >
                -
              </button>
              <span className="text-lg font-semibold">{counts[item.text] || 0}</span>
              <button
                onClick={() => handleIncrement(item.text)}
                className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </section>
      <div className="w-full justify-center flex mt-5">
        <button
          onClick={handleCheckout}
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Page;
