"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Component {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  slug: string;
  brand: string;
}

interface ComponentSlot {
  type: string;
  label: string;
  icon: string;
  required: boolean;
  selected: Component | null;
}

const COMPONENT_TYPES = [
  { type: "CPU", label: "Processor (CPU)", icon: "🧠", required: true },
  { type: "MOTHERBOARD", label: "Motherboard", icon: "🔧", required: true },
  { type: "RAM", label: "Memory (RAM)", icon: "💾", required: true },
  { type: "GPU", label: "Graphics Card (GPU)", icon: "🎮", required: false },
  { type: "STORAGE", label: "Storage (SSD/HDD)", icon: "💿", required: true },
  { type: "PSU", label: "Power Supply (PSU)", icon: "⚡", required: true },
  { type: "CASE", label: "Casing", icon: "📦", required: true },
  { type: "COOLER", label: "CPU Cooler", icon: "❄️", required: false },
  { type: "MONITOR", label: "Monitor", icon: "🖥️", required: false },
  { type: "KEYBOARD", label: "Keyboard", icon: "⌨️", required: false },
  { type: "MOUSE", label: "Mouse", icon: "🖱️", required: false },
];

export default function PCBuilderPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [components, setComponents] = useState<ComponentSlot[]>(
    COMPONENT_TYPES.map(type => ({ ...type, selected: null }))
  );
  const [buildName, setBuildName] = useState("");
  const [showSelector, setShowSelector] = useState<{ type: string; label: string } | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Component[]>([]);
  const [loading, setLoading] = useState(false);

  const totalPrice = components.reduce((sum, comp) => {
    return sum + (comp.selected?.price || 0);
  }, 0);

  const handleSelectComponent = (componentType: string, label: string) => {
    setShowSelector({ type: componentType, label });
    fetchComponentProducts(componentType);
  };

  const fetchComponentProducts = async (type: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pc-builder/components?type=${type}`);
      const data = await response.json();
      setAvailableProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching components:", error);
      toast.error("Failed to load components");
    } finally {
      setLoading(false);
    }
  };

  const handleChooseProduct = (product: Component) => {
    if (!showSelector) return;
    
    setComponents(prev => prev.map(comp => 
      comp.type === showSelector.type 
        ? { ...comp, selected: product }
        : comp
    ));
    setShowSelector(null);
    toast.success(`${product.name} added to build`);
  };

  const handleRemoveComponent = (componentType: string) => {
    setComponents(prev => prev.map(comp => 
      comp.type === componentType 
        ? { ...comp, selected: null }
        : comp
    ));
    toast.info("Component removed");
  };

  const handleSaveBuild = async () => {
    if (!session) {
      toast.error("Please login to save your build");
      router.push("/login?redirect=/pc-builder");
      return;
    }

    const requiredComponents = components.filter(c => c.required && !c.selected);
    if (requiredComponents.length > 0) {
      toast.error("Please select all required components");
      return;
    }

    if (!buildName.trim()) {
      toast.error("Please enter a build name");
      return;
    }

    try {
      const response = await fetch("/api/pc-builder/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: buildName,
          components: components
            .filter(c => c.selected)
            .map(c => ({
              componentType: c.type,
              productId: c.selected!.id,
            })),
          totalPrice,
        }),
      });

      if (response.ok) {
        toast.success("Build saved successfully!");
        // Optionally redirect to saved builds page
      } else {
        toast.error("Failed to save build");
      }
    } catch (error) {
      console.error("Error saving build:", error);
      toast.error("Failed to save build");
    }
  };

  const handleAddAllToCart = () => {
    const selectedProducts = components.filter(c => c.selected).map(c => c.selected!);
    if (selectedProducts.length === 0) {
      toast.error("No components selected");
      return;
    }

    // Add to cart logic here
    toast.success(`Added ${selectedProducts.length} components to cart`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="text-6xl mb-4">🖥️</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              PC Builder
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Build your dream PC with our custom PC builder tool
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Component Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Select Components</h2>
              
              <div className="space-y-4">
                {components.map((component) => (
                  <div key={component.type} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{component.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {component.label}
                            {component.required && <span className="text-red-500 ml-1">*</span>}
                          </h3>
                          {component.selected && (
                            <p className="text-sm text-gray-600">{component.selected.brand}</p>
                          )}
                        </div>
                      </div>
                      
                      {component.selected && (
                        <div className="text-right">
                          <p className="font-bold text-blue-600">
                            ৳{component.selected.price.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {component.selected ? (
                      <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3 mt-2">
                        <div className="flex items-center gap-3">
                          <Image
                            src={component.selected.imageUrl || "/placeholder.png"}
                            alt={component.selected.name}
                            width={50}
                            height={50}
                            className="object-contain"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{component.selected.name}</p>
                            <Link href={`/products/${component.selected.slug}`} className="text-xs text-blue-600 hover:underline">
                              View Details
                            </Link>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSelectComponent(component.type, component.label)}
                            className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Change
                          </button>
                          <button
                            onClick={() => handleRemoveComponent(component.type)}
                            className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSelectComponent(component.type, component.label)}
                        className="w-full mt-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                      >
                        + Choose {component.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Build Summary</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Build Name
                </label>
                <input
                  type="text"
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  placeholder="My Gaming PC"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Components:</span>
                  <span className="font-semibold">
                    {components.filter(c => c.selected).length} / {components.length}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Required:</span>
                  <span className="font-semibold">
                    {components.filter(c => c.required && c.selected).length} / {components.filter(c => c.required).length}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total Price:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ৳{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddAllToCart}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                  disabled={components.filter(c => c.selected).length === 0}
                >
                  Add All to Cart
                </button>
                
                <button
                  onClick={handleSaveBuild}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                  disabled={components.filter(c => c.required && !c.selected).length > 0}
                >
                  Save Build
                </button>
              </div>

              {!session && (
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Login to save your build
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Component Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold">Select {showSelector.label}</h3>
              <button
                onClick={() => setShowSelector(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : availableProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                      onClick={() => handleChooseProduct(product)}
                    >
                      <div className="flex gap-4">
                        <Image
                          src={product.imageUrl || "/placeholder.png"}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{product.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                          <p className="text-lg font-bold text-blue-600">
                            ৳{product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No products found for this category
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
