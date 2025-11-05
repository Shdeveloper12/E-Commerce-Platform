"use client"

import React from 'react'
import logo from "../../assets/logo.png";
import Link from "next/link";
import { BiSolidOffer } from "react-icons/bi";
import { BsLightningCharge, BsPerson } from "react-icons/bs";
import { motion } from "motion/react"
export default function Navber() {
  return (
    <div className="bg-black text-white ">
      <div className="flex justify-between items-center mx-auto max-w-8xl p-4">
      <div>
        <Link href="/"><img src={logo.src} className="w-20 h-12" alt="StarTech BD Logo" /></Link>
      </div>
       <div>
        <input className="w-xl p-2 placeholder:text-gray-400 text-black bg-gray-100" placeholder="search..." type="text"  />
       
       </div>
       <div className="flex gap-4 items-center">
        <div className='text-3xl text-orange-400'>
          <BiSolidOffer />
        </div>
        <div>
          <h4>Offers</h4>
        <p className="text-gray-400">Latest offers</p>
        </div>
        
       </div>
       <div className="flex gap-4 items-center">
        <motion.div
        animate={{ 
          opacity: [1, 0, 1],
          color: ['rgba(255, 255, 255, 1)', 'rgba(251, 146, 60, 1)', 'rgba(255, 255, 255, 1)']
        }}
        transition={{duration: 2, repeat: Infinity, }}
        className='text-3xl'>
          <BsLightningCharge />
        </motion.div>
        <div>
          <h4>Happy Hour</h4>
        <p className="text-gray-400">Speacial Deals</p>
       </div>
        </div>
       <div className="flex gap-4 items-center">
        <div className='text-3xl text-orange-400'>
          <BsPerson />
        </div>
        <div>
          <h4>Account</h4>
        <p className="text-gray-400"><Link href="/register">Register/</Link><Link href="/login">Login</Link></p>
       </div>
        </div>
       <div>
        <button className="text-white p-3 text-xl bg-blue-700">PC Builder</button>
       </div>
      </div>
    </div>
  )
}
