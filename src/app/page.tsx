export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to StarTech BD</h1>
      <p className="text-gray-600 mb-8">
        Your trusted e-commerce platform for technology and electronics.
      </p>
      
      {/* Your home page content goes here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Latest Products</h2>
          <p className="text-gray-600">Check out our newest arrivals</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Best Deals</h2>
          <p className="text-gray-600">Get the best prices today</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">PC Builder</h2>
          <p className="text-gray-600">Build your custom PC</p>
        </div>
      </div>
    </div>
  )
}