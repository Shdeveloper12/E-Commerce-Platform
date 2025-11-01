import Link from 'next/link'
import React from 'react'
import { IoHome } from "react-icons/io5";

export default function register() {
  return (
    <div>
        <h1 className='max-w-7xl mx-auto mt-5'><Link href="/"><IoHome /></Link></h1>
    <div className=' my-20 mx-auto max-w-md'>
        <h1 className='text-2xl font-bold mb-5'>Register Account</h1>
        <form className=''>
            <div className='flex gap-4 mb-5'>
                <div >
                    <label className='text-md font-bold mb-5' htmlFor="firstName">First Name:</label>
                <input className='border-gray-400 border-1 p-2' placeholder='First Name' type="text" id="firstName" name="firstName" required />
                </div>
                <div>
                    <label className='text-md font-bold mb-5' htmlFor="lastName">Last Name:</label>
                <input className='border-gray-400 border-1 p-2' placeholder='Last Name' type="text" id="lastName" name="lastName" required />
                </div>
                
            </div>
            <div className='mb-5'>
                <label className='text-md font-bold  block' htmlFor="email">Email:</label>
                <input className='border-gray-400 border-1 p-2' placeholder='Email' type="email" id="email" name="email" required />
            </div>
            <div className='mb-5'>
                <label className='text-md font-bold block' htmlFor="password">Password:</label>
                <input className='border-gray-400 border-1 p-2' placeholder='Password' type="password" id="password" name="password" required />
            </div>
            <button className='bg-blue-500 mb-2 hover:bg-blue-600 w-full text-white p-2 rounded' type="submit">Register</button>
        </form>
        <div>Already have an account? <a href="/login" className='text-blue-500 text-center'>Login Now</a></div>
    </div>
    </div>
  )
}
