"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useLoginMutation } from "@/lib/feature/auth/authThunk";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/feature/auth/authSlice"; // Remove setUser import
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
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      console.log('Login response:', userData);
      
      // Make sure we dispatch the complete user data
      dispatch(setCredentials(userData));
      
      console.log('Dispatched to Redux:', userData);
      
      toast.success("Login successful!");
      
      // Add a small delay and check auth state before navigation
      setTimeout(() => {
        const authState = store.getState().auth;
        console.log('Auth State before navigation:', authState);
        router.push("/");
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
    <div className="min-h-screen bg-primary text-white p-8">
      <ToastContainer />
      {/* Header */}
      <div className="max-w-xl justify-center items-center mx-auto mb-16">
        <h1 className="text-[68px] font-medium ml-24">My account</h1>
        <div className="text-white text-sm -mt-2">
          <Link href="/" className="hover:text-white ml-48">
            HOME
          </Link>
          <span className="mx-2">/</span>
          <span>MY ACCOUNT</span>
        </div>
      </div>

      {/* Login Container */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
        {/* Left Side - Login Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6">LOGIN</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">
               email address
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-transparent border border-gray-700 rounded focus:outline-none focus:border-white"
                required
              />
            </div>

            <div>
              <label className="block mb-2">
                Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 bg-transparent border border-gray-700 rounded focus:outline-none focus:border-white"
                  required
                />
                {passwordVisible ? (
                  <EyeOff
                    onClick={() => setPasswordVisible(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    size={20}
                  />
                ) : (
                  <Eye
                    onClick={() => setPasswordVisible(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    size={20}
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "LOG IN"}
            </button>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-700 bg-transparent" />
                <span>Remember me</span>
              </label>
              <Link href="/lost-password" className="text-green-500 hover:text-green-400">
                Lost your password?
              </Link>
            </div>
          </form>
        </div>

        {/* Right Side - Registration Info */}
        <div>
          <h2 className="text-2xl mb-16 mx-auto w-30">REGISTER</h2>
          <p className="text-gray-300 mb-3 text-sm">
            Registering for this site allows you to access your order status and history. Just fill
            in the fields below, and we&#39;ll get a new account set up for you in no time. We will
            only ask you for information necessary to make the purchase process faster and easier.
          </p>
          <Link href="/auth/signup">
            <button className="bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition-colors mx-auto w-30">
              REGISTER
            </button>
          </Link>
        </div>
      </div>


    </div>
  );
}
