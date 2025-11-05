
import Carousel from "@/components/ui/carousel";
import Category from "@/components/ui/category";
import Product from "@/components/ui/product";
import Service from "@/components/ui/service";

export default function Home() {
  return (
    <div>
      {/* Hero Carousel */}
      <Carousel />

      <div className="overflow-hidden bg-gray-100 py-2 container mx-auto rounded-2xl">
        <div className="animate-marquee whitespace-nowrap">
          Welcome to StarTech BD - Your one-stop shop for all tech needs!
        </div>
      </div>

      {/* <Service /> */}
      <Service />

      {/* <Category /> */}
      <Category />

      {/* Featured Products */}
      <Product />
    </div>
  );
}
