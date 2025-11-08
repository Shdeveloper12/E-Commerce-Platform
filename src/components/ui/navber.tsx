"use client";

import React from "react";
import logo from "../../assets/logo.png";
import Link from "next/link";
import { BiSolidOffer } from "react-icons/bi";
import { BsLightningCharge, BsPerson } from "react-icons/bs";
import { motion } from "motion/react";
export default function Navber() {
  {/*
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow" >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        
      </div>
      <div className="navbar-end">
        <a className="btn">Button</a>
      </div>
    </div>;
  */}
  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#1a2332] text-white">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile Menu Button */}
          <button className="text-white p-2">
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
          </button>

          {/* Mobile Logo */}
          <Link href="/">
            <img
              src={logo.src}
              className="h-8"
              alt="StarTech BD Logo"
            />
          </Link>

          {/* Mobile Search & Cart */}
          <div className="flex gap-3 items-center">
            <button className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-white relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
            </button>
          </div>
        </div>
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
        <div className="bg-gray-100 border-b shadow-sm">
          <div className="container mx-auto max-w-[1400px] px-4">
            <ul className="flex gap-3 py-3 text-sm font-medium text-gray-700 overflow-x-auto">
              <li><Link href="/desktop" className="hover:text-orange-500 transition-colors whitespace-nowrap">Desktop</Link></li>
              <li><Link href="/laptop" className="hover:text-orange-500 transition-colors whitespace-nowrap">Laptop</Link></li>
              <li><Link href="/component" className="hover:text-orange-500 transition-colors whitespace-nowrap">Component</Link></li>
              <li><Link href="/monitor" className="hover:text-orange-500 transition-colors whitespace-nowrap">Monitor</Link></li>
              <li><Link href="/power" className="hover:text-orange-500 transition-colors whitespace-nowrap">Power</Link></li>
              <li><Link href="/phone" className="hover:text-orange-500 transition-colors whitespace-nowrap">Phone</Link></li>
              <li><Link href="/tablet" className="hover:text-orange-500 transition-colors whitespace-nowrap">Tablet</Link></li>
              <li><Link href="/office-equipment" className="hover:text-orange-500 transition-colors whitespace-nowrap">Office Equipment</Link></li>
              <li><Link href="/camera" className="hover:text-orange-500 transition-colors whitespace-nowrap">Camera</Link></li>
              <li><Link href="/security" className="hover:text-orange-500 transition-colors whitespace-nowrap">Security</Link></li>
              <li><Link href="/networking" className="hover:text-orange-500 transition-colors whitespace-nowrap">Networking</Link></li>
              <li><Link href="/software" className="hover:text-orange-500 transition-colors whitespace-nowrap">Software</Link></li>
              <li><Link href="/server" className="hover:text-orange-500 transition-colors whitespace-nowrap">Server & Storage</Link></li>
              <li><Link href="/accessories" className="hover:text-orange-500 transition-colors whitespace-nowrap">Accessories</Link></li>
              <li><Link href="/gadget" className="hover:text-orange-500 transition-colors whitespace-nowrap">Gadget</Link></li>
              <li><Link href="/gaming" className="hover:text-orange-500 transition-colors whitespace-nowrap">Gaming</Link></li>
              <li><Link href="/tv" className="hover:text-orange-500 transition-colors whitespace-nowrap">TV</Link></li>
              <li><Link href="/appliance" className="hover:text-orange-500 transition-colors whitespace-nowrap">Appliance</Link></li>
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
