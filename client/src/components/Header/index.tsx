import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, Settings, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
   <header className="flex-col w-full bg-black">
 

  {/* Navigation */}
  <nav className="hidden md:flex bg-gray-800 items-center justify-between px-6 py-4.5 shadow-sm rounded-2xl mx-4 md:mx-11 mt-4">
    <div className="flex space-x-9">
      <Link href="/dashboard" className="text-[#21eb00] font-semibold hover:underline">
        Dashboard
      </Link>
      <Link href="/pv-insights" className="text-gray-300 hover:text-[#21eb00]">
        PV Insights
      </Link>
      <Link href="/user-guide" className="text-gray-300 hover:text-[#21eb00]">
        User Guide
      </Link>
      <Link href="/my-account" className="text-gray-300 hover:text-[#21eb00]">
        My Account
      </Link>
      <Link href="/market" className="text-gray-300 hover:text-[#21eb00]">
        Market
      </Link>
    </div>
    <button
      onClick={() => console.log("Logout clicked")}
      className="flex items-center text-[#21eb00] hover:text-green-400 space-x-2"
    >
      <svg width="24" height="24" fill="#21eb00" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.8 2H14.2C11 2 9 4 9 7.2V11.25H15.25C15.66 11.25 16 11.59 16 12C16 12.41 15.66 12.75 15.25 12.75H9V16.8C9 20 11 22 14.2 22H16.79C19.99 22 21.99 20 21.99 16.8V7.2C22 4 20 2 16.8 2Z"></path>
        <path d="M4.56 11.25L6.63 9.18C6.78 9.03 6.85 8.84 6.85 8.65C6.85 8.46 6.78 8.26 6.63 8.12C6.34 7.83 5.86 7.83 5.57 8.12L2.22 11.47C1.93 11.76 1.93 12.24 2.22 12.53L5.57 15.88C5.86 16.17 6.34 16.17 6.63 15.88C6.92 15.59 6.92 15.11 6.63 14.82L4.56 12.75H9V11.25H4.56Z"></path>
      </svg>
      <span className="font-medium">Logout</span>
    </button>
  </nav>
</header>

      
      
          {/* The mobile menu section only - replace the existing mobile menu code */}

          {isMobileMenuOpen && (
  <div className="md:hidden fixed inset-0 z-50">
    {/* Overlay with blur effect */}
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={() => setIsMobileMenuOpen(false)}
    />
    
    {/* Mobile Menu Panel */}
    <div
      className={`absolute inset-y-0 right-0 w-[300px] bg-black text-white transform transition-transform duration-300 ease-out shadow-2xl ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header Section */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-sm border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-secondary">Menu</h2>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Menu Content */}
      <nav className="h-[calc(100vh-70px)] overflow-y-auto px-4">
        {/* User Profile Section */}
        <div className="py-6 border-b border-gray-700">
          <div className="flex items-center space-x-4 px-2">
            <img
              src="/api/placeholder/48/48"
              alt="User"
              className="h-12 w-12 rounded-full border-2 border-secondary"
            />
            <div>
              <h3 className="font-medium text-white">John Doe</h3>
              <p className="text-sm text-gray-400">john.doe@example.com</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="py-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 px-3 py-3 rounded-lg text-secondary bg-black/60 font-medium hover:bg-secondary hover:text-black transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10H7C9 10 10 9 10 7V5C10 3 9 2 7 2H5C3 2 2 3 2 5V7C2 9 3 10 5 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/pv-insights"
            className="flex items-center space-x-3 px-3 py-3 rounded-lg text-white hover:bg-secondary hover:text-black transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>PV Insights</span>
          </Link>

          <Link
            href="/market"
            className="flex items-center space-x-3 px-3 py-3 rounded-lg text-white hover:bg-secondary hover:text-black transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.01001 11.22V15.71C3.01001 20.2 4.81001 22 9.30001 22H14.69C19.18 22 20.98 20.2 20.98 15.71V11.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Market</span>
          </Link>
        </div>

        {/* Bottom Section with Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 bg-black/80 backdrop-blur-sm p-4">
          <button
            onClick={() => {
              console.log('Logout clicked');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center justify-center w-full space-x-2 px-4 py-3 rounded-lg bg-secondary text-black hover:bg-secondary/80 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.8 2H14.2C11 2 9 4 9 7.2V11.25H15.25C15.66 11.25 16 11.59 16 12C16 12.41 15.66 12.75 15.25 12.75H9V16.8C9 20 11 22 14.2 22H16.79C19.99 22 21.99 20 21.99 16.8V7.2C22 4 20 2 16.8 2Z" fill="currentColor" />
              <path d="M4.55994 11.25L6.62994 9.18C6.77994 9.03 6.84994 8.84 6.84994 8.65C6.84994 8.46 6.77994 8.26 6.62994 8.12C6.33994 7.83 5.85994 7.83 5.56994 8.12L2.21994 11.47C1.92994 11.76 1.92994 12.24 2.21994 12.53L5.56994 15.88C5.85994 16.17 6.33994 16.17 6.62994 15.88C6.91994 15.59 6.91994 15.11 6.62994 14.82L4.55994 12.75H8.99994V11.25H4.55994Z" fill="currentColor" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  </div>
)}

    </>
  );
};

export default Header;