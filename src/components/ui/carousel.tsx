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
    <div className="w-full mx-auto my-8">
      <div className="container mx-auto px-4">
        <div className="relative w-full max-w-7xl mx-auto rounded-md shadow-md shadow-blue-300 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <div className="relative h-[400px] md:h-[500px] w-full">
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
                  fill
                  className="object-cover rounded-2xl"
                  priority={index === 0}
                />
              </div>
            ))}

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-10"
            >
              ❮
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-10"
            >
              ❯
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  current === idx ? "bg-orange-400 scale-125" : "bg-white bg-opacity-70"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
