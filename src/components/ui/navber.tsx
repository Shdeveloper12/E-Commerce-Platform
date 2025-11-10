"use client";

import React, { useState } from "react";
import logo from "../../assets/tech-bazar.png";
import Link from "next/link";
import { BiSolidOffer, BiChevronDown, BiChevronRight } from "react-icons/bi";
import { BsLightningCharge, BsPerson, BsX } from "react-icons/bs";
import { motion } from "motion/react";

export default function Navber() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categories = [
    { 
      name: "Desktop", 
      href: "/desktop",
      subcategories: [
        { name: "Brand PC", href: "/desktop/brand-pc" },
        { name: "Gaming PC", href: "/desktop/gaming-pc" },
        { name: "Custom PC", href: "/desktop/custom-pc" },
        { name: "All-in-One PC", href: "/desktop/all-in-one" },
        { name: "Portable Mini PC", href: "/desktop/mini-pc" },
      ]
    },
    { 
      name: "Laptop", 
      href: "/laptop",
      subcategories: [
        { name: "All Laptop", href: "/laptop/all" },
        { name: "Gaming Laptop", href: "/laptop/gaming" },
        { name: "Ultrabook", href: "/laptop/ultrabook" },
        { name: "MacBook", href: "/laptop/macbook" },
        { name: "Traditional Laptop", href: "/laptop/traditional" },
      ]
    },
    { 
      name: "Component", 
      href: "/component",
      subcategories: [
        { name: "Processor", href: "/component/processor" },
        { name: "Motherboard", href: "/component/motherboard" },
        { name: "RAM", href: "/component/ram" },
        { name: "Graphics Card", href: "/component/graphics-card" },
        { name: "SSD", href: "/component/ssd" },
        { name: "HDD", href: "/component/hdd" },
        { name: "Casing", href: "/component/casing" },
        { name: "Cooler", href: "/component/cooler" },
        { name: "Power Supply", href: "/component/power-supply" },
      ]
    },
    { 
      name: "Monitor", 
      href: "/monitor",
      subcategories: [
        { name: "Gaming Monitor", href: "/monitor/gaming" },
        { name: "Professional Monitor", href: "/monitor/professional" },
        { name: "Regular Monitor", href: "/monitor/regular" },
      ]
    },
    { 
      name: "UPS", 
      href: "/ups",
      subcategories: [
        { name: "Online UPS", href: "/ups/online" },
        { name: "Offline UPS", href: "/ups/offline" },
        { name: "IPS", href: "/ups/ips" },
      ]
    },
    { 
      name: "Phone", 
      href: "/phone",
      subcategories: [
        { name: "Samsung", href: "/phone/samsung" },
        { name: "iPhone", href: "/phone/iphone" },
        { name: "Xiaomi", href: "/phone/xiaomi" },
        { name: "Realme", href: "/phone/realme" },
        { name: "OPPO", href: "/phone/oppo" },
        { name: "Vivo", href: "/phone/vivo" },
        { name: "OnePlus", href: "/phone/oneplus" },
        { name: "Infinix", href: "/phone/infinix" },
        { name: "Feature Phone", href: "/phone/feature" },
      ]
    },
    { 
      name: "Tablet", 
      href: "/tablet",
      subcategories: [
        { name: "iPad", href: "/tablet/ipad" },
        { name: "Samsung Tab", href: "/tablet/samsung" },
        { name: "Android Tablet", href: "/tablet/android" },
      ]
    },
    { 
      name: "Office Equipment", 
      href: "/office-equipment",
      subcategories: [
        { name: "Printer", href: "/office/printer" },
        { name: "Scanner", href: "/office/scanner" },
        { name: "Photocopier", href: "/office/photocopier" },
        { name: "Attendance Machine", href: "/office/attendance" },
        { name: "Projector", href: "/office/projector" },
      ]
    },
    { 
      name: "Camera", 
      href: "/camera",
      subcategories: [
        { name: "DSLR Camera", href: "/camera/dslr" },
        { name: "Action Camera", href: "/camera/action" },
        { name: "Mirrorless Camera", href: "/camera/mirrorless" },
        { name: "Webcam", href: "/camera/webcam" },
        { name: "IP Camera", href: "/camera/ip" },
      ]
    },
    { 
      name: "Security", 
      href: "/security",
      subcategories: [
        { name: "CC Camera", href: "/security/cc-camera" },
        { name: "CCTV Camera", href: "/security/cctv" },
        { name: "IP Camera", href: "/security/ip-camera" },
        { name: "DVR", href: "/security/dvr" },
        { name: "NVR", href: "/security/nvr" },
      ]
    },
    { 
      name: "Networking", 
      href: "/networking",
      subcategories: [
        { name: "Router", href: "/networking/router" },
        { name: "Switch", href: "/networking/switch" },
        { name: "Access Point", href: "/networking/access-point" },
        { name: "Network Adapter", href: "/networking/adapter" },
        { name: "Modem", href: "/networking/modem" },
      ]
    },
    { 
      name: "Software", 
      href: "/software",
      subcategories: [
        { name: "Antivirus", href: "/software/antivirus" },
        { name: "Operating System", href: "/software/os" },
        { name: "Office Software", href: "/software/office" },
        { name: "Design Software", href: "/software/design" },
      ]
    },
    { 
      name: "Server & Storage", 
      href: "/server",
      subcategories: [
        { name: "Server", href: "/server/server" },
        { name: "NAS", href: "/server/nas" },
        { name: "Storage", href: "/server/storage" },
      ]
    },
    { 
      name: "Accessories", 
      href: "/accessories",
      subcategories: [
        { name: "Keyboard", href: "/accessories/keyboard" },
        { name: "Mouse", href: "/accessories/mouse" },
        { name: "Headphone", href: "/accessories/headphone" },
        { name: "Speaker", href: "/accessories/speaker" },
        { name: "Webcam", href: "/accessories/webcam" },
        { name: "Microphone", href: "/accessories/microphone" },
        { name: "USB Hub", href: "/accessories/usb-hub" },
        { name: "Cable & Adapter", href: "/accessories/cable" },
      ]
    },
    { 
      name: "Gadget", 
      href: "/gadget",
      subcategories: [
        { name: "Smart Watch", href: "/gadget/smart-watch" },
        { name: "Earbuds", href: "/gadget/earbuds" },
        { name: "Power Bank", href: "/gadget/power-bank" },
        { name: "Trimmer", href: "/gadget/trimmer" },
        { name: "Drone", href: "/gadget/drone" },
        { name: "Gimbal", href: "/gadget/gimbal" },
      ]
    },
    { 
      name: "Gaming", 
      href: "/gaming",
      subcategories: [
        { name: "Gaming Console", href: "/gaming/console" },
        { name: "Gaming Chair", href: "/gaming/chair" },
        { name: "Gaming Desk", href: "/gaming/desk" },
        { name: "Gaming Accessories", href: "/gaming/accessories" },
      ]
    },
    { 
      name: "TV", 
      href: "/tv",
      subcategories: [
        { name: "Smart TV", href: "/tv/smart" },
        { name: "Android TV", href: "/tv/android" },
        { name: "LED TV", href: "/tv/led" },
      ]
    },
    { 
      name: "Appliance", 
      href: "/appliance",
      subcategories: [
        { name: "Air Conditioner", href: "/appliance/ac" },
        { name: "Refrigerator", href: "/appliance/refrigerator" },
        { name: "Washing Machine", href: "/appliance/washing-machine" },
        { name: "Microwave Oven", href: "/appliance/oven" },
        { name: "Water Heater", href: "/appliance/water-heater" },
      ]
    },
  ];
  
  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#1a2332] text-white relative z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 hover:bg-gray-700 rounded transition-colors"
          >
            {mobileMenuOpen ? (
              <BsX className="h-7 w-7" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Mobile Logo */}
          <Link href="/">
            <img
              src={logo.src}
              className="h-12"
              alt="StarTech BD Logo"
            />
          </Link>

          {/* Mobile Search & Cart */}
          <div className="flex gap-3 items-center">
            <button className="text-white p-2 hover:bg-gray-700 rounded transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-white relative p-2 hover:bg-gray-700 rounded transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Sidebar */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: mobileMenuOpen ? 0 : "-100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 left-0 h-full w-[280px] bg-white shadow-2xl z-50 overflow-y-auto"
        >
          <div className="p-4">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Categories</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-red-500 p-2"
              >
                <BsX className="h-7 w-7" />
              </button>
            </div>

            {/* Category List */}
            <nav className="space-y-1">
              {categories.map((category, index) => (
                <div key={index}>
                  <div
                    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors font-medium cursor-pointer"
                    onClick={() => {
                      if (category.subcategories) {
                        setOpenSubmenu(openSubmenu === category.name ? null : category.name);
                      } else {
                        setMobileMenuOpen(false);
                      }
                    }}
                  >
                    <Link 
                      href={category.href}
                      onClick={(e) => {
                        if (category.subcategories) {
                          e.preventDefault();
                        } else {
                          setMobileMenuOpen(false);
                        }
                      }}
                      className="flex-1"
                    >
                      {category.name}
                    </Link>
                    {category.subcategories && (
                      <BiChevronRight
                        className={`text-xl transition-transform ${
                          openSubmenu === category.name ? "rotate-90" : ""
                        }`}
                      />
                    )}
                  </div>
                  {category.subcategories && openSubmenu === category.name && (
                    <div className="ml-4 space-y-1 border-l-2 border-orange-200">
                      {category.subcategories.map((sub, subIndex) => (
                        <Link
                          key={subIndex}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Overlay */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40"
          />
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        {/* Top Bar */}
        <div className="bg-[#1a2332] text-white">
          <div className="container mx-auto max-w-[1400px] px-4">
            <div className="flex justify-between items-center py-4 gap-6">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <img
                  src={logo.src}
                  className="h-12"
                  alt="StarTech BD Logo"
                />
              </Link>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl relative">
                <input
                  className="w-full px-4 py-2.5 rounded-md placeholder:text-gray-400 text-black bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Search"
                  type="text"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Offers */}
              <Link href="/offers" className="flex gap-2 items-center hover:text-orange-400 transition-colors">
                <BiSolidOffer className="text-3xl text-orange-500" />
                <div>
                  <h4 className="font-semibold text-sm leading-tight">Offers</h4>
                  <p className="text-xs text-gray-400">Latest Offers</p>
                </div>
              </Link>

              {/* Happy Hour */}
              <Link href="/happy-hour" className="flex gap-2 items-center hover:text-orange-400 transition-colors">
                <motion.div
                  animate={{
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl text-yellow-400"
                >
                  <BsLightningCharge />
                </motion.div>
                <div>
                  <h4 className="font-semibold text-sm leading-tight">Happy Hour</h4>
                  <p className="text-xs text-gray-400">Special Deals</p>
                </div>
              </Link>

              {/* Account */}
              <Link href="/login" className="flex gap-2 items-center hover:text-orange-400 transition-colors">
                <BsPerson className="text-3xl text-orange-500" />
                <div>
                  <h4 className="font-semibold text-sm leading-tight">Account</h4>
                  <p className="text-xs text-gray-400">
                    <span className="hover:underline">Register</span>
                    {" "}<span>or</span>{" "}
                    <span className="hover:underline">Login</span>
                  </p>
                </div>
              </Link>

              {/* PC Builder Button */}
              <Link href="/pc-builder">
                <button className="text-white px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 rounded transition-colors whitespace-nowrap">
                  PC Builder
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="bg-gray-100 border-b shadow-sm relative z-50">
          <div className="container mx-auto max-w-[1400px] px-4">
            <ul className="flex gap-3 py-3 text-sm font-medium text-gray-700 flex-wrap justify-center">
              {categories.map((category, index) => (
                <li
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    href={category.href}
                    className="hover:text-orange-500 transition-colors whitespace-nowrap flex justify-between gap-1 py-1"
                  >
                    {category.name}
                    {category.subcategories && <BiChevronDown className="text-sm" />}
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {category.subcategories && hoveredCategory === category.name && (
                    <div className="absolute top-full left-0 mt-1 bg-white shadow-2xl rounded-md py-2 min-w-[220px] z-[50] border border-gray-200 max-h-[400px] overflow-y-auto">
                      {category.subcategories.map((sub, subIndex) => (
                        <Link
                          key={subIndex}
                          href={sub.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors whitespace-nowrap"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1a2332] text-white shadow-2xl z-50 border-t border-gray-700">
        <div className="flex justify-around items-center py-2">
          {/* Offers */}
          <Link href="/offers" className="flex flex-col items-center py-2 px-3 hover:text-orange-400 transition-colors">
            <BiSolidOffer className="text-2xl mb-1" />
            <span className="text-[10px] font-medium">Offers</span>
          </Link>

          {/* Happy Hour */}
          <Link href="/happy-hour" className="flex flex-col items-center py-2 px-3 hover:text-orange-400 transition-colors">
            <motion.div
              animate={{
                opacity: [1, 0.5, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BsLightningCharge className="text-2xl mb-1" />
            </motion.div>
            <span className="text-[10px] font-medium">Happy Hour</span>
          </Link>

          {/* PC Builder */}
          <Link href="/pc-builder" className="flex flex-col items-center py-2 px-3 hover:text-orange-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] font-medium">PC Builder</span>
          </Link>

          {/* Compare */}
          <Link href="/compare" className="flex flex-col items-center py-2 px-3 hover:text-orange-400 transition-colors relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-[10px] font-medium">Compare</span>
            <span className="absolute top-1 right-2 bg-orange-500 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold">0</span>
          </Link>

          {/* Account */}
          <Link href="/login" className="flex flex-col items-center py-2 px-3 hover:text-orange-400 transition-colors">
            <BsPerson className="text-2xl mb-1" />
            <span className="text-[10px] font-medium">Account</span>
          </Link>
        </div>
      </div>

      {/* Bottom padding for mobile to prevent content being hidden behind fixed bottom nav */}
      <div className="lg:hidden h-16"></div>
    </>
      
   
  );
}
