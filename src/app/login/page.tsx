"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IoHome } from "react-icons/io5";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div>
      <h1 className="max-w-7xl mx-auto mt-5">
        <Link href="/">
          <IoHome />
        </Link>
      </h1>
      <div className=" my-30 mx-auto max-w-md p-5">
        <h1 className="text-2xl font-bold mb-5">Login to Your Account</h1>
        <form onSubmit={handleSubmit} className="">
             {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          <div className="mb-5">
            <label className="text-md font-bold  block" htmlFor="email">
              Email:
            </label>
            <input
              className="border-gray-400 border-1 p-2 w-full rounded"
              placeholder="Email"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <label className="text-md font-bold block" htmlFor="password">
              Password:
            </label>
            <input
              className="border-gray-400 border-1 p-2 w-full rounded"
              placeholder="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              required
            />
          </div>
          <button
            className="bg-blue-500 mb-2 hover:bg-blue-600 w-full text-white p-2 rounded"
            type="submit"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div>
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 text-center">
            Register Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
