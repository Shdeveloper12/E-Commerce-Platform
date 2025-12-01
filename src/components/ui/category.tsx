import React from "react";
import Link from "next/link";
import { GiDeliveryDrone } from "react-icons/gi";
import { IoMdTv } from "react-icons/io";
import { CiMobile2 } from "react-icons/ci";
import { IoWatchOutline } from "react-icons/io5";
import { CiCamera } from "react-icons/ci";
import { GiConsoleController } from "react-icons/gi";
import { SlEarphones } from "react-icons/sl";
import { BsDeviceSsd } from "react-icons/bs";
import { GiBoombox } from "react-icons/gi";
import { BsLightningCharge } from "react-icons/bs";

export default function Category() {
  const featuredCategories = [
    { name: "Laptop", slug: "laptop", icon: <CiMobile2 /> },
    { name: "Desktop", slug: "desktop", icon: <IoMdTv /> },
    { name: "Component", slug: "component", icon: <BsDeviceSsd /> },
    { name: "Monitor", slug: "monitor", icon: <IoMdTv /> },
    { name: "Phone", slug: "phone", icon: <CiMobile2 /> },
    { name: "Gaming", slug: "gaming", icon: <GiConsoleController /> },
    { name: "Camera", slug: "camera", icon: <CiCamera /> },
    { name: "Accessories", slug: "accessories", icon: <SlEarphones /> },
    { name: "Gadget", slug: "gadget", icon: <IoWatchOutline /> },
    { name: "Networking", slug: "networking", icon: <BsLightningCharge /> },
  ];

  return (
    <div>
      <div className="container text-center mx-auto mt-4 px-4">
        <h1 className="text-2xl font-bold">Featured Categories</h1>
        <p className="">Explore our wide range of categories tailored to your needs.</p>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {featuredCategories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/category/${category.slug}`}
              className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <h2 className="text-xl flex justify-center font-semibold mb-2">
                {category.icon}
              </h2>
              <p className="text-black font-bold hover:text-orange-400">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
