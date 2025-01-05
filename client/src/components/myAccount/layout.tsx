"use client";
import React, { useState } from "react";
import {
  FileText,
  User,
  Heart,
  LogOut,
  X,
  Settings,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { logout, setUser } from "@/lib/feature/auth/authSlice";
import { useDispatch } from "react-redux";

interface MenuLinkProps {
  link: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const MenuLink:React.FC<MenuLinkProps> = ({ link, icon: Icon, label }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (label === "Logout") {
        setShowLogoutModal(true);
      } else {
        router.push(link);
      }
      setIsMobileMenuOpen(false);
    };

    return (
      <a
        href={link}
        onClick={handleClick}
        className={`group relative flex items-center space-x-3 rounded-xl transition-all duration-300 hover:bg-zinc-900
          ${location.pathname === link ? "bg-gradient-to-r from-[#21eb00]/10 to-transparent text-[#21eb00]" : "text-zinc-400 hover:text-white"}`}
      >
        <div className="flex items-center space-x-3">
          <Icon
            className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 
            ${location.pathname === link ? "text-[#21eb00]" : "text-zinc-400 group-hover:text-white"}`}
          />
          <span className="font-medium">{label}</span>
        </div>
        {location.pathname === link && (
          <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#21eb00]" />
        )}
        <ChevronRight
          className={`ml-auto h-4 w-4 opacity-0 transition-all duration-300 
          ${location.pathname === link ? "text-[#21eb00] opacity-100" : "group-hover:opacity-100"}`}
        />
      </a>
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(setUser(null));
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setShowLogoutModal(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white lg:flex-row">
      {/* Mobile Menu Button */}
      <div className="fixed left-4 top-4 z-50 block lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-lg bg-zinc-900 p-2 text-white hover:bg-zinc-800"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } fixed inset-0 z-50 w-full transform bg-black transition-all duration-300 lg:static lg:block lg:w-56`}
      >
        <div className="flex h-full flex-col border-r border-zinc-800 bg-black/95 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between lg:mb-8">
            <h1 className="bg-gradient-to-r from-[#21eb00] to-emerald-500 bg-clip-text text-2xl font-bold text-transparent">
              DASHBOARD
            </h1>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg bg-zinc-900 p-2 text-white hover:bg-zinc-800 lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="space-y-10">
            <MenuLink
              link="/profile/assignProfile"
              icon={Settings}
              label="Total Machine"
            />
            <MenuLink link="/profile/withdraw" icon={User} label="Withdraw" />
            <MenuLink link="#" icon={LogOut} label="Logout" />
          </nav>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="mb-4 text-xl font-semibold">Confirm Logout</h3>
            <p className="mb-6 text-zinc-400">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 text-white"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 bg-black">
        <div className="mx-auto max-w-full">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
