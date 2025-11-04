
import Carousel from "@/components/ui/carousel";
import Category from "@/components/ui/category";
import Product from "@/components/ui/product";
import Service from "@/components/ui/service";

export default function Home() {

  return (
    <div>
      {/* Hero Carousel */}
        <Carousel />

      {/* <Service /> */}
         <Service />

     {/* <Category /> */}
         <Category />

     {/* Featured Products */}
         <Product />

    </div>
  );
}
