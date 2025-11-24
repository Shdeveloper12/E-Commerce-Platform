"use client";

import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/tech-bazar.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiSolidOffer, BiChevronDown, BiChevronRight } from "react-icons/bi";
import { BsLightningCharge, BsPerson, BsX, BsBoxArrowRight, BsHeart, BsSearch } from "react-icons/bs";
import { motion, AnimatePresence } from "motion/react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCompareStore } from "@/store/compare-store";
import Image from "next/image";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  brand: string;
  imageUrl: string;
  category: string;
}

export default function Navber() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { getTotalItems, setUserId: setCartUserId } = useCartStore();
  const { getTotalItems: getWishlistCount } = useWishlistStore();
  const { setUserId: setCompareUserId } = useCompareStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const accountButtonRef = useRef<HTMLDivElement>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync user ID with cart and compare stores
  useEffect(() => {
    const userId = session?.user?.id || null;
    setCartUserId(userId);
    setCompareUserId(userId);
  }, [session, setCartUserId, setCompareUserId]);

  // Update cart and wishlist count on client side to prevent hydration mismatch
  useEffect(() => {
    setCartCount(getTotalItems());
    setWishlistCount(getWishlistCount());
  }, [getTotalItems, getWishlistCount, session]);

  // Search functionality with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    if (searchQuery.trim().length < 2) {
      return;
    }

    setSearchLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data.results || []);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  const handleSearchResultClick = () => {
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const handleLogout = async () => {
    // User-specific cart and compare will be cleared automatically by setUserId(null)
    toast.success("Logged out successfully");
    await signOut({ callbackUrl: '/' });
  };

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const categories = [
    { 
      name: "Desktop", 
      href: "/category/desktop",
      subcategories: [
        { name: "Desktop Offer", href: "/category/desktop-offer" },
        { name: "Star PC", href: "/category/star-pc" },
        { name: "Gaming PC", href: "/category/gaming-pc" },
        { name: "Brand PC", href: "/category/brand-pc" },
        { name: "All-in-One PC", href: "/category/all-in-one-pc" },
        { name: "Portable Mini PC", href: "/category/portable-mini-pc" },
        { name: "Apple Mac Mini", href: "/category/apple-mac-mini" },
        { name: "Apple iMac", href: "/category/apple-imac" },
        { name: "Apple Mac Studio", href: "/category/apple-mac-studio" },
        { name: "Apple Mac Pro", href: "/category/apple-mac-pro" },
      ]
    },
    { 
      name: "Laptop", 
      href: "/category/laptop",
      subcategories: [
        { name: "All Laptop", href: "/category/all-laptop" },
        { name: "OLED Laptop", href: "/category/oled-laptop" },
        { name: "Gaming Laptop", href: "/category/gaming-laptop" },
        { name: "Premium Ultrabook", href: "/category/premium-ultrabook" },
        { name: "Laptop Bag", href: "/category/laptop-bag" },
        { name: "External Graphics Enclosure", href: "/category/external-graphics-enclosure" },
        { name: "Laptop Accessories", href: "/category/laptop-accessories" },
        { name: "Pentium and Celeron Laptop", href: "/category/pentium-celeron-laptop" },
        { name: "Intel Core i3 Laptop", href: "/category/core-i3-laptop" },
        { name: "Intel Core i5 Laptop", href: "/category/core-i5-laptop" },
        { name: "Intel Core i7 Laptop", href: "/category/core-i7-laptop" },
        { name: "Intel Core i9 Laptop", href: "/category/core-i9-laptop" },
      ]
    },
    { 
      name: "Component", 
      href: "/category/component",
      subcategories: [
        { name: "Processor", href: "/category/processor" },
        { name: "CPU Cooler", href: "/category/cpu-cooler" },
        { name: "Water/Liquid Cooling", href: "/category/water-cooling" },
        { name: "Motherboard", href: "/category/motherboard" },
        { name: "Graphics Card", href: "/category/graphics-card" },
        { name: "RAM (Desktop)", href: "/category/ram-desktop" },
        { name: "RAM (Laptop)", href: "/category/ram-laptop" },
        { name: "Power Supply", href: "/category/power-supply" },
        { name: "Hard Disk Drive", href: "/category/hard-disk-drive" },
        { name: "Portable Hard Disk Drive", href: "/category/portable-hard-disk-drive" },
        { name: "SSD", href: "/category/ssd" },
        { name: "Portable SSD", href: "/category/portable-ssd" },
        { name: "Casing", href: "/category/casing" },
        { name: "Casing Cooler", href: "/category/casing-cooler" },
        { name: "Optical Drive", href: "/category/optical-drive" },
        { name: "Thermal Paste", href: "/category/thermal-paste" },
      ]
    },
    { 
      name: "Monitor", 
      href: "/category/monitor",
      subcategories: [
        { name: "LCD Monitors", href: "/category/lcd-monitors" },
        { name: "LED Monitors", href: "/category/led-monitors" },
        { name: "Gaming Monitor", href: "/category/gaming-monitor" },
        { name: "Curved Monitor", href: "/category/curved-monitor" },
        { name: "Touch Monitor", href: "/category/touch-monitor" },
        { name: "Ultra-wide Monitor", href: "/category/ultra-wide-monitor" },
        { name: "Portable Monitor", href: "/category/portable-monitor" },
      ]
    },
    { 
      name: "UPS", 
      href: "/category/ups",
      subcategories: [
        { name: "Online UPS", href: "/category/online-ups" },
        { name: "Offline UPS", href: "/category/offline-ups" },
        { name: "IPS", href: "/category/ips" },
      ]
    },
    { 
      name: "Phone", 
      href: "/category/phone",
      subcategories: [
        { name: "Samsung", href: "/category/samsung-phone" },
        { name: "iPhone", href: "/category/iphone" },
        { name: "Xiaomi", href: "/category/xiaomi" },
        { name: "Realme", href: "/category/realme" },
        { name: "OPPO", href: "/category/oppo" },
        { name: "Vivo", href: "/category/vivo" },
        { name: "OnePlus", href: "/category/oneplus" },
        { name: "Infinix", href: "/category/infinix" },
        { name: "Feature Phone", href: "/category/feature-phone" },
      ]
    },
    { 
      name: "Tablet", 
      href: "/category/tablet",
      subcategories: [
        { name: "Graphics Tablet", href: "/category/graphics-tablet" },
        { name: "Kids Tablet", href: "/category/kids-tablet" },
        { name: "iPad", href: "/category/ipad" },
        { name: "Samsung Tab", href: "/category/samsung-tab" },
        { name: "Android Tablet", href: "/category/android-tablet" },
      ]
    },
    { 
      name: "Office Equipment", 
      href: "/category/office-equipment",
      subcategories: [
        { name: "Projector", href: "/category/projector" },
        { name: "Conference System", href: "/category/conference-system" },
        { name: "PA System", href: "/category/pa-system" },
        { name: "Interactive Flat Panel", href: "/category/interactive-flat-panel" },
        { name: "Video Wall", href: "/category/video-wall" },
        { name: "Signage", href: "/category/signage" },
        { name: "Kiosk", href: "/category/kiosk" },
        { name: "Printer", href: "/category/printer" },
        { name: "Laser Printer", href: "/category/laser-printer" },
        { name: "Large Format Printer", href: "/category/large-format-printer" },
        { name: "ID Card Printer", href: "/category/id-card-printer" },
        { name: "POS Printer", href: "/category/pos-printer" },
        { name: "Label Printer", href: "/category/label-printer" },
        { name: "Dot Matrix Printer", href: "/category/dot-matrix-printer" },
        { name: "Photocopier", href: "/category/photocopier" },
        { name: "Toner", href: "/category/toner" },
        { name: "Cartridge", href: "/category/cartridge" },
        { name: "Ink Bottle", href: "/category/ink-bottle" },
        { name: "Printer Paper", href: "/category/printer-paper" },
        { name: "Ribbon", href: "/category/ribbon" },
        { name: "Printer Drum", href: "/category/printer-drum" },
        { name: "Scanner", href: "/category/scanner" },
        { name: "Barcode Scanner", href: "/category/barcode-scanner" },
        { name: "Cash Drawer", href: "/category/cash-drawer" },
        { name: "Telephone Set", href: "/category/telephone-set" },
        { name: "IP Phone", href: "/category/ip-phone" },
        { name: "PABX System", href: "/category/pabx-system" },
        { name: "Money Counting Machine", href: "/category/money-counting-machine" },
        { name: "Paper Shredder", href: "/category/paper-shredder" },
        { name: "Laminating Machine", href: "/category/laminating-machine" },
        { name: "Binding Machine", href: "/category/binding-machine" },
      ]
    },
    { 
      name: "Camera", 
      href: "/category/camera",
      subcategories: [
        { name: "DSLR Camera", href: "/category/dslr-camera" },
        { name: "Digital Camera", href: "/category/digital-camera" },
        { name: "Handycam", href: "/category/handycam" },
        { name: "Camera Lenses", href: "/category/camera-lenses" },
        { name: "Action Camera", href: "/category/action-camera" },
        { name: "Mirrorless Camera", href: "/category/mirrorless-camera" },
        { name: "Video Camera", href: "/category/video-camera" },
        { name: "Dash Cam", href: "/category/dash-cam" },
        { name: "Instant Camera", href: "/category/instant-camera" },
        { name: "Camera Tripod", href: "/category/camera-tripod" },
        { name: "Camera Accessories", href: "/category/camera-accessories" },
      ]
    },
    { 
      name: "Security", 
      href: "/category/security",
      subcategories: [
        { name: "CC Camera", href: "/category/cc-camera" },
        { name: "CCTV Camera", href: "/category/cctv-camera" },
        { name: "IP Camera", href: "/category/ip-camera" },
        { name: "DVR", href: "/category/dvr" },
        { name: "NVR", href: "/category/nvr" },
      ]
    },
    { 
      name: "Networking", 
      href: "/category/networking",
      subcategories: [
        { name: "Router", href: "/category/router" },
        { name: "Switch", href: "/category/switch" },
        { name: "Access Point", href: "/category/access-point" },
        { name: "Network Adapter", href: "/category/network-adapter" },
        { name: "Modem", href: "/category/modem" },
      ]
    },
    { 
      name: "Software", 
      href: "/category/software",
      subcategories: [
        { name: "Antivirus", href: "/category/antivirus" },
        { name: "Operating System", href: "/category/operating-system" },
        { name: "Office Software", href: "/category/office-software" },
        { name: "Design Software", href: "/category/design-software" },
      ]
    },
    { 
      name: "Server & Storage", 
      href: "/category/server-storage",
      subcategories: [
        { name: "Server", href: "/category/server" },
        { name: "NAS", href: "/category/nas" },
        { name: "Storage", href: "/category/storage" },
      ]
    },
    { 
      name: "Accessories", 
      href: "/category/accessories",
      subcategories: [
        { name: "Keyboard", href: "/category/keyboard" },
        { name: "Mouse", href: "/category/mouse" },
        { name: "Headphone", href: "/category/headphone" },
        { name: "Bluetooth Headphone", href: "/category/bluetooth-headphone" },
        { name: "Mouse Pad", href: "/category/mouse-pad" },
        { name: "Wrist Rest", href: "/category/wrist-rest" },
        { name: "Headphone Stand", href: "/category/headphone-stand" },
        { name: "Speaker & Home Theater", href: "/category/speaker-home-theater" },
        { name: "Bluetooth Speakers", href: "/category/bluetooth-speakers" },
        { name: "Webcam", href: "/category/webcam" },
        { name: "Soundbar", href: "/category/soundbar" },
        { name: "Cable", href: "/category/cable" },
        { name: "Converter", href: "/category/converter" },
        { name: "Card Reader", href: "/category/card-reader" },
        { name: "Hubs & Docks", href: "/category/hubs-docks" },
      ]
    },
    { 
      name: "Gadget", 
      href: "/category/gadget",
      subcategories: [
        { name: "Smart Watch", href: "/category/smart-watch" },
        { name: "Smart Band", href: "/category/smart-band" },
        { name: "Earphone", href: "/category/earphone" },
        { name: "Earbuds", href: "/category/earbuds" },
        { name: "Neckband", href: "/category/neckband" },
        { name: "Smart Glasses", href: "/category/smart-glasses" },
        { name: "Mini Fan", href: "/category/mini-fan" },
        { name: "Smart Ring", href: "/category/smart-ring" },
        { name: "Power Bank", href: "/category/power-bank" },
        { name: "TV Box", href: "/category/tv-box" },
        { name: "Studio Equipment", href: "/category/studio-equipment" },
        { name: "Drones", href: "/category/drones" },
        { name: "Gimbal", href: "/category/gimbal" },
        { name: "Daily Lifestyle", href: "/category/daily-lifestyle" },
        { name: "Calculator", href: "/category/calculator" },
        { name: "Blower Machine", href: "/category/blower-machine" },
      ]
    },
    { 
      name: "Gaming", 
      href: "/category/gaming",
      subcategories: [
        { name: "Gaming Chair", href: "/category/gaming-chair" },
        { name: "Gaming Desk", href: "/category/gaming-desk" },
        { name: "Keyboard", href: "/category/gaming-keyboard" },
        { name: "Mouse", href: "/category/gaming-mouse" },
        { name: "Headphone", href: "/category/gaming-headphone" },
        { name: "Mouse Pad", href: "/category/gaming-mouse-pad" },
        { name: "Gamepad", href: "/category/gamepad" },
        { name: "VR", href: "/category/vr" },
        { name: "Gaming Console", href: "/category/gaming-console" },
        { name: "Gaming Sofa", href: "/category/gaming-sofa" },
        { name: "Games", href: "/category/games" },
      ]
    },
    { 
      name: "TV", 
      href: "/category/tv",
      subcategories: [
        { name: "Smart TV", href: "/category/smart-tv" },
        { name: "Android TV", href: "/category/android-tv" },
        { name: "LED TV", href: "/category/led-tv" },
      ]
    },
    { 
      name: "Appliance", 
      href: "/category/appliance",
      subcategories: [
        { name: "Air Conditioner", href: "/category/air-conditioner" },
        { name: "Refrigerator", href: "/category/refrigerator" },
        { name: "Washing Machine", href: "/category/washing-machine" },
        { name: "Microwave Oven", href: "/category/microwave-oven" },
        { name: "Water Heater", href: "/category/water-heater" },
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

          {/* Mobile Search, Compare, Wishlist & Cart */}
          <div className="flex gap-3 items-center">
            <button 
              onClick={() => setShowMobileSearch(true)}
              className="text-white p-2 hover:bg-gray-700 rounded transition-colors"
            >
              <BsSearch className="h-6 w-6" />
            </button>
            <Link href="/compare" className="text-white p-2 hover:bg-gray-700 rounded transition-colors block">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </Link>
            <Link href="/account/wishlist" className="text-white relative p-2 hover:bg-gray-700 rounded transition-colors block">
              <BsHeart className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="text-white relative p-2 hover:bg-gray-700 rounded transition-colors block">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
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

            {/* User Section - Mobile */}
            {session && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <BsPerson className="text-3xl text-orange-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800 text-sm">
                        {session.user?.name || session.user?.email}
                      </p>
                      {(session.user?.role === 'ADMIN' || session.user?.role === 'MODERATOR') && (
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          session.user?.role === 'ADMIN' 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-blue-500 text-white'
                        }`}>
                          {session.user?.role}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                  </div>
                </div>
                
                {/* Admin Dashboard Link - Mobile */}
                {(session.user?.role === 'ADMIN' || session.user?.role === 'MODERATOR') && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 mb-2 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors border-l-4 border-purple-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin Dashboard
                  </Link>
                )}

                <div className="flex flex-col gap-1">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <BsBoxArrowRight />
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Login/Register - Mobile */}
            {!session && status !== "loading" && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-center text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-center text-orange-500 border border-orange-500 hover:bg-orange-50 rounded-md transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}

            {/* Category List */}
            <nav className="space-y-1 sticky top-0 bg-white z-50">
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
              <div className="flex-1 max-w-2xl relative" ref={searchRef}>
                <form onSubmit={handleSearch}>
                  <input
                    className="w-full px-4 py-2.5 rounded-md placeholder:text-gray-400 text-black bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Search for products..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                  >
                    <BsSearch className="h-5 w-5" />
                  </button>
                </form>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showSearchResults && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[70vh] overflow-y-auto z-[9999]"
                    >
                      {searchLoading ? (
                        <div className="p-4 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <>
                          <div className="p-3 border-b border-gray-100 bg-gray-50">
                            <p className="text-sm text-gray-600 font-medium">
                              {searchResults.length} {searchResults.length === 1 ? "result" : "results"} found
                            </p>
                          </div>
                          {searchResults.map((result) => (
                            <Link
                              key={result.id}
                              href={`/products/${result.slug}`}
                              onClick={handleSearchResultClick}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                            >
                              <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                <img
                                  src={result.imageUrl}
                                  alt={result.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {result.name}
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {result.brand} • {result.category}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {result.discountPrice ? (
                                    <>
                                      <span className="text-sm font-bold text-orange-600">
                                        {result.discountPrice.toLocaleString()}৳
                                      </span>
                                      <span className="text-xs text-gray-400 line-through">
                                        {result.price.toLocaleString()}৳
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-sm font-bold text-gray-900">
                                      {result.price.toLocaleString()}৳
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                          <Link
                            href={`/search?q=${encodeURIComponent(searchQuery)}`}
                            onClick={handleSearchResultClick}
                            className="block p-3 text-center text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors"
                          >
                            View all results for "{searchQuery}"
                          </Link>
                        </>
                      ) : (
                        <div className="p-6 text-center">
                          <BsSearch className="mx-auto text-3xl text-gray-300 mb-2" />
                          <p className="text-sm text-gray-600">No products found</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
              <div 
                ref={accountButtonRef}
                className="relative"
                onMouseEnter={() => setShowAccountDropdown(true)}
                onMouseLeave={() => setShowAccountDropdown(false)}
              >
                {status === "loading" ? (
                  <div className="flex gap-2 items-center">
                    <BsPerson className="text-3xl text-orange-500 animate-pulse" />
                    <div>
                      <h4 className="font-semibold text-sm leading-tight">Account</h4>
                      <p className="text-xs text-gray-400">Loading...</p>
                    </div>
                  </div>
                ) : session ? (
                  <>
                    <Link href="/account" className="flex gap-2 items-center hover:text-orange-400 transition-colors cursor-pointer">
                      <BsPerson className="text-3xl text-orange-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm leading-tight">Account</h4>
                          {(session.user?.role === 'ADMIN' || session.user?.role === 'MODERATOR') && (
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              session.user?.role === 'ADMIN' 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-blue-500 text-white'
                            }`}>
                              {session.user?.role}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate max-w-[120px]">
                          {session.user?.name || session.user?.email}
                        </p>
                      </div>
                    </Link>

                    {/* Dropdown Menu */}
                    {showAccountDropdown && (
                      <div className="fixed top-[62px] right-15 bg-white shadow-2xl rounded-md min-w-[200px] z-[9999] border border-gray-200 max-h-[400px] overflow-y-auto">
                        {/* Admin Dashboard Link - Only for ADMIN and MODERATOR */}
                        {(session.user?.role === 'ADMIN' || session.user?.role === 'MODERATOR') && (
                          <>
                            <Link
                              href="/admin"
                              className="block px-4 py-2.5 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors border-l-4 border-purple-500"
                            >
                              <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Admin Dashboard
                              </div>
                            </Link>
                            <div className="border-t border-gray-200 my-1"></div>
                          </>
                        )}
                        
                        <Link
                          href="/account"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/account/orders"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/account/wishlist"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          Wish List
                        </Link>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <BsBoxArrowRight />
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex gap-2 items-center hover:text-orange-400 transition-colors">
                    <BsPerson className="text-3xl text-orange-500" />
                    <div>
                      <h4 className="font-semibold text-sm leading-tight">Account</h4>
                      <p className="text-xs text-gray-400">
                        <Link href="/register" className="hover:underline">Register</Link>
                        {" "}<span>or</span>{" "}
                        <Link href="/login" className="hover:underline">Login</Link>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* PC Builder Button */}
              <Link href="/pc-builder">
                <button className="text-white hover:cursor-pointer px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 rounded transition-colors whitespace-nowrap">
                  PC Builder
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation - Sticky (Outside desktop wrapper) */}
      <div className="hidden lg:block bg-gray-100 border-b shadow-md sticky top-0 z-[999] backdrop-blur-sm bg-opacity-95">
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
                  <div className="absolute top-full left-0 bg-white shadow-2xl rounded-md py-2 min-w-[220px] z-[1000] border border-gray-200 max-h-[400px] overflow-y-auto">
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

          {/* Wishlist */}
          <Link href="/account/wishlist" className="flex flex-col items-center py-2 px-3 hover:text-orange-400 transition-colors relative">
            <BsHeart className="text-2xl mb-1" />
            <span className="text-[10px] font-medium">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-2 bg-red-500 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Account */}
          {session ? (
            <Link href="/account" className="flex flex-col items-center py-2 px-3 hover:text-orange-400 transition-colors">
              <BsPerson className="text-2xl mb-1" />
              <span className="text-[10px] font-medium">Profile</span>
            </Link>
          ) : (
            <Link href="/login" className="flex flex-col items-center py-2 px-3 hover:text-orange-400 transition-colors">
              <BsPerson className="text-2xl mb-1" />
              <span className="text-[10px] font-medium">Account</span>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom padding for mobile to prevent content being hidden behind fixed bottom nav */}
      <div className="lg:hidden h-16"></div>

      {/* Mobile Search Modal */}
      <AnimatePresence>
        {showMobileSearch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSearch(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-0 left-0 right-0 bg-white z-[101] p-4 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setShowMobileSearch(false)}
                  className="text-gray-600 p-2"
                >
                  <BsX className="text-3xl" />
                </button>
                <h3 className="text-lg font-semibold">Search Products</h3>
              </div>
              
              <form onSubmit={(e) => {
                handleSearch(e);
                setShowMobileSearch(false);
              }}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-600 p-2"
                  >
                    <BsSearch className="text-xl" />
                  </button>
                </div>
              </form>

              {/* Mobile Search Results */}
              {searchQuery.trim().length > 0 && (
                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                  {searchLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((result) => (
                        <Link
                          key={result.id}
                          href={`/products/${result.slug}`}
                          onClick={() => {
                            setShowMobileSearch(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-16 h-16 flex-shrink-0 bg-white rounded overflow-hidden">
                            <img
                              src={result.imageUrl}
                              alt={result.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {result.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {result.brand}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {result.discountPrice ? (
                                <>
                                  <span className="text-sm font-bold text-orange-600">
                                    {result.discountPrice.toLocaleString()}৳
                                  </span>
                                  <span className="text-xs text-gray-400 line-through">
                                    {result.price.toLocaleString()}৳
                                  </span>
                                </>
                              ) : (
                                <span className="text-sm font-bold text-gray-900">
                                  {result.price.toLocaleString()}৳
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                      <Link
                        href={`/search?q=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          setShowMobileSearch(false);
                          setSearchQuery("");
                        }}
                        className="block p-3 text-center text-sm font-medium text-orange-600 bg-orange-50 rounded-lg"
                      >
                        View all results
                      </Link>
                    </div>
                  ) : searchQuery.trim().length >= 2 ? (
                    <div className="text-center py-8">
                      <BsSearch className="mx-auto text-3xl text-gray-300 mb-2" />
                      <p className="text-sm text-gray-600">No products found</p>
                    </div>
                  ) : null}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
      
   
  );
}
