"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { db } from "@/app/firebase";
import useAuth from "@/app/hooks/useauth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import QRCode from "react-qr-code";
export const runtime = 'edge';
// Define types for Brand and Product
interface Product {
  productName: string;
  count: number;
}

interface Brand {
  brandName: string;
  productName: string;
  count: number;
  products?: Product[];
}

const Page: React.FC = () => {
  const { slug } = useParams();
  const [data, setData] = useState<boolean | null>(null);
  const [products, setproducts] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [qrCodeData, setQRCodeData] = useState<string>("");
  const [brands, setBrands] = useState<Brand[]>([
    { brandName: "", productName: "", count: 1 },
  ]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const router = useRouter();

  const { user } = useAuth();

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

  // Increment function
  const handleIncrement = (productName: string) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [productName]: (prevCounts[productName] || 0) + 1,
    }));
  };

  const generateRandomQRData = () => {
    return Math.random().toString(36).substring(2, 15);
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
            brand: localStorage.getItem("selected"),
            productJSON: data
              ? JSON.stringify(brands)
              : JSON.stringify(Object.entries(counts).map(([product, count]) => ({
                product,
                count,
              }))),
            verified: 2,
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

  // Decrement function
  const handleDecrement = (productName: string) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [productName]: Math.max((prevCounts[productName] || 0) - 1, 0),
    }));
  };

  // Check if at least one product from "Vijay Sales" has a count > 0
  const isQRCodeEnabled = products.some(
    (item :any) =>
      item.BrandName === localStorage.getItem("selected") &&
      (counts[item.ProductName] || 0) > 0
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://student-discount.fk4460467.workers.dev/checkbrand",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              selected: localStorage.getItem("selected") || slug,
            }),
          }
        );
        const result: any = await response.json();
        setData(result.isManual);
        if (!response.ok) {
          throw new Error("Failed to fetch data from server");
        }
      } catch (error) {
        console.error("Error checking brand:", error);
      } finally {
        if (!data) {
          try {
            const response = await fetch(
              "https://student-discount.fk4460467.workers.dev/api/automatic",
              {
                method: "GET",
              }
            );
            const result: any = await response.json();
            setproducts(result);
            if (!response.ok) {
              throw new Error("Failed to fetch data from server");
            }
          } catch (error) {
            console.error("Error in Getting Data", error);
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    index: number,
    field: keyof Brand,
    value: string | number
  ) => {
    const updatedBrands:any = [...brands];
    updatedBrands[index][field] = value;
    setBrands(updatedBrands);
  };

  const addMoreBrands = () => {
    setBrands([...brands, { brandName: "", productName: "", count: 1 }]);
  };

  const deletebrand = (index: number) => {
    const updatedBrands = [...brands]; 
    updatedBrands.splice(index, 1); 
    setBrands(updatedBrands);
  };
  

  const addMoreProducts = (brandIndex: number) => { 
    const updatedBrands = [...brands];
    if (!updatedBrands[brandIndex].products) {
      updatedBrands[brandIndex].products = [];
    }
    updatedBrands[brandIndex].products!.push({ productName: "", count: 1 });
    setBrands(updatedBrands);
  };

  const deleteProduct = (brandIndex: number, productIndex: number) => {
    const updatedBrands = [...brands];
    updatedBrands[brandIndex].products!.splice(productIndex, 1);
    setBrands(updatedBrands);
  };

  const handleProductChange = (
    brandIndex: number,
    productIndex: number,
    field: keyof Product,
    value: string | number
  ) => {
    const updatedBrands:any = [...brands];
    updatedBrands[brandIndex].products![productIndex][field] = value;
    setBrands(updatedBrands);
  };

  const isQRCodeEnabled2 = brands.some(
    (item) => item.brandName && item.productName && item.count > 0
  );
  return (
    <div className="mx-6 mt-20">
      {data && !loading && !showQR && (
        <div className="xl:w-1/3 mx-auto">
          <p className="text-center font-semibold xl:text-2xl text-xl font-serif mb-2">
            {localStorage.getItem("selected")}
          </p>
          <div>
            {brands.map((brand, index) => (
              <div key={index} className=" p-4 mb-4 rounded shadow-xl">
                <div className="mb-4 ">
                  {brands.length>1 && (
                  <div onClick={()=> deletebrand(index)} className={`${index==0 ? 'hidden' :'visible'} p-1 rounded-full justify-end flex hover:cursor-pointer`}>
                    <svg className=" rounded-full"
                              xmlns="http://www.w3.org/2000/svg"
                              height="19px"
                              viewBox="0 -960 960 960"
                              width="19px"
                              fill="red"
                            >
                              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                            </svg>
                    </div>
                  )}
                  

                  <label className="block mb-2 font-semibold">Brand Name</label>
                  <input
                    type="text"
                    value={brand.brandName}
                    onChange={(e) =>
                      handleInputChange(index, "brandName", e.target.value)
                    }
                    placeholder="Enter Brand Name"
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-semibold">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={brand.productName}
                    onChange={(e) =>
                      handleInputChange(index, "productName", e.target.value)
                    }
                    placeholder="Enter Product Name"
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Count</label>
                  <input
                    type="number"
                    value={brand.count}
                    min={1}
                    placeholder="Enter Count"
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "count",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>

                {brand.products &&
                  brand.products.map((product, productIndex) => (
                    <div
                      key={productIndex}
                      className="border border-black p-2 mt-2 rounded shadow-sm"
                    >
                      <label className="block mb-2 font-semibold">
                        Product {productIndex + 2}
                      </label>
                      <input
                        type="text"
                        value={product.productName}
                        onChange={(e) =>
                          handleProductChange(
                            index,
                            productIndex,
                            "productName",
                            e.target.value
                          )
                        }
                        placeholder="Product Name"
                        className="w-full p-2 border rounded"
                      />
                      <label className="block mb-2 font-semibold mt-2">
                        Count
                      </label>
                      <input
                        type="number"
                        value={product.count}
                        min={1}
                        onChange={(e) =>
                          handleProductChange(
                            index,
                            productIndex,
                            "count",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full p-2 border rounded"
                      />
                      <div className="flex justify-between">
                        <button
                          onClick={() => addMoreProducts(index)}
                          className="p-2 mt-2 rounded-full text-xs bg-blue-500 text-white flex border "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="15px"
                            viewBox="0 -960 960 960"
                            width="15px"
                            fill="white"
                          >
                            <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                          </svg>
                          Add more
                        </button>
                        <button
                          onClick={() => deleteProduct(index, productIndex)}
                          className="mt-2 px-3 py-2 text-xs bg-red-500 text-white rounded-full flex justify-center items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="15px"
                            viewBox="0 -960 960 960"
                            width="15px"
                            fill="#e8eaed"
                          >
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                {!brand.products && (
                  <button
                    onClick={() => addMoreProducts(index)}
                    className="p-2 mt-2 rounded-full text-xs bg-blue-500 text-white flex border "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="15px"
                      viewBox="0 -960 960 960"
                      width="15px"
                      fill="white"
                    >
                      <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                    </svg>
                    Add more
                  </button>
                )}
              </div>
            ))}
            <div className="mt-10 flex-col flex items-center space-y-2">
              <button
                onClick={addMoreBrands}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Add Brands
              </button>
              <button
                disabled={!isQRCodeEnabled2}
                onClick={handleGenerateQRCode}
                className={`${
                  isQRCodeEnabled2
                    ? "bg-blue-500 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                } px-2 py-2 bg-cyan-500 text-white m-0 rounded-full`}
              >
                Generate QR Code
              </button>
            </div>
          </div>
        </div>
      )}
      {!data && !loading && !showQR && (
        <div>
          <p className="text-center font-serif xl:text-2xl font-semibold mb-4 text-xl">
            {localStorage.getItem("selected")}
          </p>
          <section className="grid grid-cols-2 xl:gap-6 gap-2  xl:mx-4 xl:grid-cols-4">
            {products
              .filter(
                (item:any) => item.BrandName == localStorage.getItem("selected")
              )
              .map((item:any, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center border rounded-lg shadow-md py-2 bg-white"
                >
                  <img
                    src={item.BrandURL}
                    alt={item.ProductName}
                    className="h-24 xl:h-32 w-32 object-cover rounded-md mb-4"
                  />
                  <p className="font-bold text-sm xl:text-lg text-center mb-4">
                    {item.ProductName}
                  </p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleDecrement(item.ProductName)}
                      className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">
                      {counts[item.ProductName] || 0}
                    </span>
                    <button
                      onClick={() => handleIncrement(item.ProductName)}
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
              onClick={handleGenerateQRCode}
              disabled={!isQRCodeEnabled}
              className={`${
                isQRCodeEnabled
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white font-semibold py-2 px-4 rounded`}
            >
              Generate QR code
            </button>
          </div>
        </div>
      )}
      {loading && (
        <Skeleton count={5} height={100} width={300}  className="mt-10" />
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
