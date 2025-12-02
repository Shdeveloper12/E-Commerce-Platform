"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  IoHome,
  IoMail,
  IoLockClosed,
  IoPerson,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! Please sign in.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8"
      suppressHydrationWarning
    >
      <div className="max-w-md mx-auto relative">
        <Link
          href="/"
          className="absolute -top-4 left-0 sm:left-0 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group z-10"
        >
          <IoHome className="text-xl sm:text-2xl group-hover:scale-110 transition-transform" />
          <span className="font-medium text-sm sm:text-base">Home</span>
        </Link>
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg mb-4 animate-pulse">
            <IoCheckmarkCircle className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Join TechBazar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your account and start shopping
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200 animate-slide-down">
                <AlertDescription className="flex items-center gap-2">
                  <IoCheckmarkCircle className="text-xl" />
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Name Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  htmlFor="firstName"
                >
                  <IoPerson className="text-purple-500" />
                  First Name
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 pl-10 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="John"
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <IoPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  htmlFor="lastName"
                >
                  <IoPerson className="text-purple-500" />
                  Last Name
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 pl-10 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Doe"
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  <IoPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                htmlFor="email"
              >
                <IoMail className="text-purple-500" />
                Email Address
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 pl-10 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="you@example.com"
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <IoMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                htmlFor="password"
              >
                <IoLockClosed className="text-purple-500" />
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 pl-10 pr-12 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <IoLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Must be at least 8 characters long
              </p>
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full px-4 py-3 border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 font-semibold rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
            >
              Sign In Instead
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          By creating an account, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
