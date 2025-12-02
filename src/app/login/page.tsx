"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  IoHome,
  IoMail,
  IoLockClosed,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Loader2 } from "lucide-react";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
      } else {
        router.push(redirect);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      console.log("Login attempt finished");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4 animate-pulse">
            <IoCheckmarkCircle className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to continue to TechBazar
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                htmlFor="email"
              >
                <IoMail className="text-blue-500" />
                Email Address
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 pl-10 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="you@example.com"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                <IoLockClosed className="text-blue-500" />
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 pl-10 pr-12 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
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
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
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
                New to TechBazar?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center w-full px-4 py-3 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            >
              Create an Account
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
