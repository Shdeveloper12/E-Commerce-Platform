"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import image1 from "../../assets/offer1.webp"
import image2 from "../../assets/offer2.webp"
import image3 from "../../assets/offer3.webp"
import Image from "next/image"




export default function Carousel() {
  const images = [image1, image2, image3];
  const [current, setCurrent] = useState(0);
  const length = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 3000);

    return () => clearInterval(interval);
  }, [length]);

  const nextSlide = () => setCurrent((current + 1) % length);
  const prevSlide = () => setCurrent((current - 1 + length) % length);

  return (
    
      <div className="max-w-7xl mx-auto my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 p-5 gap-50 lg:gap-10 lg:grid-cols-2 ">
          <div className="relative w-full max-w-6xl mx-auto rounded-lg  shadow-md shadow-blue-300 hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-auto w-auto">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === current ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Slide ${index + 1}`}
                    className=" object-cover w-full rounded-2xl"
                  />
                </div>
              ))}

              <button
                onClick={prevSlide}
                className="absolute left-2 mt-20 lg:mt-36 transform -translate-y-1/2 bg-gray-400 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                ❮
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 mt-20 lg:mt-36 transform -translate-y-1/2 bg-gray-400 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                ❯
              </button>
            </div>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-3 h-3 rounded-full ${
                    current === idx ? "bg-orange-400" : "bg-green-500"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
   
  );
}
