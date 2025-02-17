// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { Eye, EyeOff, Phone } from "lucide-react";
import { useRegisterMutation } from "@/lib/feature/auth/authThunk";
import Select from 'react-select';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js';

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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  // Format countries for react-select
  const countryOptions = getCountries().map(country => ({
    value: country,
    label: `${new Intl.DisplayNames(['en'], { type: 'region' }).of(country)} (+${getCountryCallingCode(country)})`,
    dialCode: getCountryCallingCode(country)
  }));

  // Custom styles for react-select to match the dark theme
  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      background: 'rgba(55, 65, 81, 0.5)',
      borderColor: state.isFocused ? '#22c55e' : '#4B5563',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(34, 197, 94, 0.2)' : 'none',
      borderRadius: '0.5rem',
      padding: '0.25rem',
      '&:hover': {
        borderColor: '#22c55e'
      }
    }),
    menu: (base: any) => ({
      ...base,
      background: '#1F2937',
      border: '1px solid #4B5563'
    }),
    option: (base: any, { isFocused, isSelected }: any) => ({
      ...base,
      backgroundColor: isSelected ? '#22c55e' : isFocused ? '#374151' : '#1F2937',
      color: 'white',
      '&:hover': {
        backgroundColor: '#374151'
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'white'
    }),
    input: (base: any) => ({
      ...base,
      color: 'white'
    })
  };

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('http://ip-api.com/json');
        const data = await response.json();
        // ip-api returns 'countryCode' instead of 'country_code'
        const countryOption = countryOptions.find(option => 
          option.value === data.countryCode
        );
        if (countryOption) {
          setSelectedCountry(countryOption);
        } else {
          // Fallback to default country (optional)
          const defaultCountry = countryOptions.find(option => 
            option.value === 'US'
          );
          setSelectedCountry(defaultCountry);
        }
      } catch (error) {
        console.error('Error detecting country:', error);
      } finally {
        setLoadingLocation(false);
      }
    };
  
    detectCountry();
  }, []);

  const validatePhoneNumber = (phone: string, country: string) => {
    if (!country) return false;
    try {
      const phoneNumber = parsePhoneNumber(phone, country);
      return phoneNumber && phoneNumber.isValid();
    } catch {
      return false;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (selectedCountry) {
      const asYouType = new AsYouType(selectedCountry.value);
      const formattedNumber = asYouType.input(value);
      setPhoneNumber(formattedNumber);
    } else {
      setPhoneNumber(value);
    }
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

    if (!selectedCountry) {
      toast.error("Please select a country!");
      return;
    }

    if (!validatePhoneNumber(phoneNumber, selectedCountry.value)) {
      toast.error("Please enter a valid phone number!");
      return;
    }

    const formattedPhone = `+${selectedCountry.dialCode}${phoneNumber.replace(/\D/g, '')}`;

    try {
      await register({ 
        firstName, 
        lastName, 
        email, 
        password, 
        country: selectedCountry.value,
        phoneNumber: formattedPhone
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
    <div className="min-h-screen bg-gradient-to-b from-primary to-gray-900 md:p-8 text-white flex flex-col">
      <ToastContainer />
      {/* Header */}
      <div className="mx-auto mt-7 mb-12 max-w-3xl items-center justify-center text-center">
        <h1 className="md:text-6xl text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
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
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:p-8 p-3 shadow-2xl border border-gray-700">
          <h2 className="mb-8 text-2xl font-bold text-center text-green-400">REGISTER</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 md:gap-6 gap-4">
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
                <Select
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  isLoading={loadingLocation}
                  styles={customStyles}
                  placeholder="Select a country"
                  className="text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Phone Number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-600 bg-gray-700/50 text-gray-300">
                    {selectedCountry ? `+${selectedCountry.dialCode}` : '+'}
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="w-full rounded-r-lg border border-gray-600 bg-gray-700/50 p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
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