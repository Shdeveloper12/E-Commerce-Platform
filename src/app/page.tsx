
import { IoMdSearch } from "react-icons/io";
import logo from "../assets/logo.png";
import Link from "next/link";
export default function Home() {
  return (
    <div className="bg-black text-white ">
      <div className="flex justify-between items-center mx-auto max-w-8xl p-4">
      <div>
        <img src={logo.src} className="w-20 h-12" alt="StarTech BD Logo" />
      </div>
       <div>
        <input className="w-xl bg-white p-2 placeholder:text-gray-400" placeholder="search..." type="text"  />
       
       </div>
       <div>
        <h4>offers</h4>
        <p className="text-gray-400">Latest offers</p>
       </div>
       <div>
        <h4>Happy Hour</h4>
       <p className="text-gray-400">Speacial Deals</p>
       </div>
       <div>
        <h4>Account</h4>
        <p className="text-gray-400"><Link href="/register">Register/</Link><Link href="/login">Login</Link></p>
       </div>
       <div>
        <button className="text-white p-3 text-xl bg-blue-700">PC Builder</button>
       </div>
      </div>
    </div>
  )
}