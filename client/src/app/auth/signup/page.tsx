// @ts-nocheck

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { Eye, EyeOff, Phone } from "lucide-react";
import { useRegisterMutation } from "@/lib/feature/auth/authThunk";

interface RegisterError {
  status?: number;
  data?: {
    message?: string;
  };
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Please enter a valid phone number!");
      return;
    }

    try {
      await register({ 
        firstName, 
        lastName, 
        email, 
        password, 
        country,
        phoneNumber 
      }).unwrap();
      toast.success("Registration successful!");
      router.push("/");
    } catch (error) {
      const err = error as RegisterError;
      if (err?.status === 400) {
        toast.error(err.data?.message || "Registration failed.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-gray-900 p-8 text-white flex flex-col">
      <ToastContainer />
      {/* Header */}
      <div className="mx-auto mb-12 max-w-3xl items-center justify-center text-center">
        <h1 className="text-6xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
          Create account
        </h1>
        <div className="mt-4 text-sm text-gray-300">
          <Link href="/" className="hover:text-green-500 transition-colors">
            HOME
          </Link>
          <span className="mx-2">/</span>
          <span>REGISTER</span>
        </div>
      </div>

      {/* Register Container */}
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Register Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-gray-700">
          <h2 className="mb-8 text-2xl font-bold text-center text-green-400">REGISTER</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  First Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Last Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Email address
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Country
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Phone Number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-3 pl-10 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
                  required
                />
                {passwordVisible ? (
                  <EyeOff
                    onClick={() => setPasswordVisible(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-green-500 transition-colors"
                    size={18}
                  />
                ) : (
                  <Eye
                    onClick={() => setPasswordVisible(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-green-500 transition-colors"
                    size={18}
                  />
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Confirm Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                className="rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                I agree to the{' '}
                <Link href="/terms" className="text-green-400 hover:text-green-500 transition-colors">
                  Terms and Conditions
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 py-3 text-white transition-all hover:from-green-600 hover:to-green-700 disabled:opacity-50 font-medium shadow-lg shadow-green-500/20"
              disabled={isLoading || !agreedToTerms}
            >
              {isLoading ? "Registering..." : "REGISTER"}
            </button>
          </form>
        </div>

        {/* Have an Account Section */}
        <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
          <p className="text-gray-300">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-green-400 hover:text-green-500 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}