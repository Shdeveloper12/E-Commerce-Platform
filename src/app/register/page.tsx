"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { IoHome } from "react-icons/io5";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    
  });
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
    <div>
      <h1 className="max-w-7xl mx-auto mt-5">
        <Link href="/">
          <IoHome />
        </Link>
      </h1>
      <div className=" my-20 mx-auto max-w-md p-5">
        <h1 className="text-2xl font-bold mb-5">Register Account</h1>
        <form onSubmit={handleSubmit} className="">
             {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          <div className="flex gap-4 mb-5">
            <div>
              <label className="text-md font-bold mb-5" htmlFor="firstName">
                First Name:
              </label>
              <input
                className="border-gray-400 border-1 p-2"
                placeholder="First Name"
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-md font-bold mb-5" htmlFor="lastName">
                Last Name:
              </label>
              <input
                className="border-gray-400 border-1 p-2 w-full rounded"
                placeholder="Last Name"
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
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
              required
                value={formData.email}
              onChange={handleChange}
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
              name="password"
                value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            className="bg-blue-500 mb-2 hover:bg-blue-600 w-full text-white p-2 rounded"
            type="submit" disabled={isLoading}
          >
            {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
          </button>
        </form>
        <div>
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 text-center">
            Login Now
          </a>
        </div>
      </div>
    </div>
  );
}
