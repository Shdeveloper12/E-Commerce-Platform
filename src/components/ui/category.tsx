import React from "react";
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
  return (
    <div>
      <div className="container text-center mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Featured Categories</h1>
        <p className="">Explore our wide range of categories tailored to your needs.</p>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl flex justify-center font-semibold mb-2"><GiDeliveryDrone /></h2>
            <p className="text-black font-bold hover:text-orange-400">Drones</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl flex justify-center font-semibold mb-2"><IoMdTv /></h2>
            <p className="text-black font-bold hover:text-orange-400">Televisions</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl flex justify-center font-semibold mb-2"><CiMobile2 /></h2>
            <p className="text-black font-bold hover:text-orange-400">Smartphones</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl flex justify-center font-semibold mb-2"><IoWatchOutline /></h2>
            <p className="text-black font-bold hover:text-orange-400">Smart Watches</p>
          </div>
            <div className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl flex justify-center font-semibold mb-2"><CiCamera /></h2>
            <p className="text-black font-bold hover:text-orange-400">Digital Cameras</p>
          </div>
            <div className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl flex justify-center font-semibold mb-2"><GiConsoleController /></h2>
            <p className="text-black font-bold hover:text-orange-400">Gaming Consoles</p>
          </div>
           <div className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl flex justify-center font-semibold mb-2"><SlEarphones /></h2>
            <p className="text-black font-bold hover:text-orange-400">Wireless Earbuds</p>
          </div>
              <div className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl flex justify-center font-semibold mb-2"><BsDeviceSsd /></h2>
            <p className="text-black font-bold hover:text-orange-400">Portable SSDs</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl flex justify-center font-semibold mb-2"><GiBoombox /></h2>
            <p className="text-black font-bold hover:text-orange-400">Portable Speakers</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl flex justify-center font-semibold mb-2"><BsLightningCharge /></h2>
            <p className="text-black font-bold hover:text-orange-400">Portable Chargers</p>
          </div>
      </div>
    </div>
    </div>
  );
}
