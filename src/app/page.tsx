
import { MdLaptopChromebook } from "react-icons/md";
import { MdReportProblem } from "react-icons/md";
import { MdHomeRepairService } from "react-icons/md";
import { MdBuild } from "react-icons/md";
import { Card, CardContent } from "@/components/ui/card";
import Carousel from "@/components/ui/carousel";

export default function Home() {

  return (
    <div>
      <Carousel />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome to Our Service</h1>

      {/* Your home page content goes here */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex bg-white gap-4 items-center p-6 border rounded-lg justify-between">
          <div className="text-blue-600">
            <MdLaptopChromebook size={48} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Laptop Finder</h2>
            <p className="text-gray-600">Find Your Perfect Laptop</p>
          </div>
        </div>
        <div className="flex bg-white p-6 border rounded-lg gap-5 justify-between items-center">
          <div className="text-red-600">
            <MdReportProblem size={48} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Raise A Complain</h2>
            <p className="text-gray-600">We're here to help you</p>
          </div>
        </div>
        <div className="flex gap-4 bg-white items-center p-6 border rounded-lg justify-between">
          <div className="text-green-600">
            <MdHomeRepairService size={48} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Home Service</h2>
            <p className="text-gray-600">Get expert help at home</p>
          </div>
        </div>
        <div className="flex gap-4 bg-white items-center p-6 border rounded-lg justify-between">
          <div className="text-purple-600">
            <MdBuild size={48} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Servicing Center</h2>
            <p className="text-gray-600">Repair Your Device</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
