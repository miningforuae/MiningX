// @ts-nocheck

"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useLoginMutation } from "@/lib/feature/auth/authThunk";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/feature/auth/authSlice";
import 'react-toastify/dist/ReactToastify.css';
import { store } from "@/lib/store/store";

interface LoginError {
  status?: number;
  data?: {
    message?: string;
  };
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      console.log('Login response:', userData);
      
      dispatch(setCredentials(userData));
      console.log('Dispatched to Redux:', userData);
      
      toast.success("Login successful!");
      
      setTimeout(() => {
        const authState = store.getState().auth;
        console.log('Auth State before navigation:', authState);
        router.push("/profile");
      }, 100);
      
    } catch (error) {
      console.error('Login error:', error);
      const err = error as LoginError;
      if (err?.status === 404) {
        toast.error("User not found, please sign up.");
      } else if (err?.status === 400) {
        toast.error("Invalid email or password.");
      } else {
        toast.error("Login failed. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-gray-900 md:p-8 text-white flex flex-col">
      <ToastContainer />
      
      {/* Header */}
      <div className="mx-auto mt-7 mb-12 max-w-3xl items-center justify-center text-center">
        <h1 className="md:text-6xl text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
          My Account
        </h1>
        <div className="mt-4 text-sm text-gray-300">
          <Link href="/" className="hover:text-green-500 transition-colors">
            HOME
          </Link>
          <span className="mx-2">/</span>
          <span>MY ACCOUNT</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Login Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-green-400 mb-8">LOGIN</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-3 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 p-3 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-300">Remember me</span>
                </label>
                <Link 
                  href="/lost-password" 
                  className="text-sm text-green-400 hover:text-green-500 transition-colors"
                >
                  Lost your password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 py-3 text-white transition-all hover:from-green-600 hover:to-green-700 disabled:opacity-50 font-medium shadow-lg shadow-green-500/20"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "LOG IN"}
              </button>
            </form>
          </div>

          {/* Register Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-green-400 mb-8">REGISTER</h2>
            <div className="space-y-6">
              <p className="text-gray-300">
                Registering for this site allows you to access your order status and history. 
                Just fill in the fields below, and we ll get a new account set up for you in no time. 
                We will only ask you for information necessary to make the purchase process faster and easier.
              </p>
              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                <h3 className="text-lg font-medium text-white mb-4">Benefits of Creating an Account:</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Order tracking and history
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Faster checkout process
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Special offers and discounts
                  </li>
                </ul>
              </div>
              <Link href="/auth/signup">
                <button 
                  className="w-full rounded-lg bg-white/10 backdrop-blur-sm py-3 text-white transition-all hover:bg-white/20 font-medium border border-gray-600"
                >
                  CREATE AN ACCOUNT
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}