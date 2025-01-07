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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { logout, setUser } from "@/lib/feature/auth/authSlice";
import { useDispatch } from "react-redux";

interface MenuLinkProps {
  link: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  isMobile?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const MenuLink: React.FC<MenuLinkProps> = ({ link, icon: Icon, label, isMobile }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (label === "Logout") {
        setShowLogoutModal(true);
      } else {
        router.push(link);
      }
    };

    const isActive = location.pathname === link;

    if (isMobile) {
      return (
        <a
          href={link}
          onClick={handleClick}
          className="flex flex-col items-center space-y-1 px-4 py-2 relative"
        >
          <Icon
            className={`h-5 w-5 ${
              isActive ? "text-[#21eb00]" : "text-zinc-400"
            }`}
          />
          <span className={`text-xs ${
            isActive ? "text-[#21eb00]" : "text-zinc-400"
          }`}>
            {label}
          </span>
          {isActive && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#21eb00]" />
          )}
        </a>
      );
    }

    return (
      <a
        href={link}
        onClick={handleClick}
        className={`group relative flex items-center space-x-3 rounded-xl p-3 transition-all duration-300 hover:bg-zinc-900
          ${isActive ? "bg-gradient-to-r from-[#21eb00]/10 to-transparent text-[#21eb00]" : "text-zinc-400 hover:text-white"}`}
      >
        <div className="flex items-center space-x-3">
          <Icon
            className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 
            ${isActive ? "text-[#21eb00]" : "text-zinc-400 group-hover:text-white"}`}
          />
          <span className="font-medium">{label}</span>
        </div>
        {isActive && (
          <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#21eb00]" />
        )}
        <ChevronRight
          className={`ml-auto h-4 w-4 opacity-0 transition-all duration-300 
          ${isActive ? "text-[#21eb00] opacity-100" : "group-hover:opacity-100"}`}
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

  const navigationLinks = [
    { link: "/profile/assignProfile", icon: Settings, label: "Total Machine" },
    { link: "/profile/withdraw", icon: User, label: "Withdraw" },
    { link: "#", icon: LogOut, label: "Logout" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-black text-white lg:flex-row">
      {/* Mobile Navigation Bar */}
      <div className=" top-0 left-0 right-0 z-50 bg-black/95 border-b border-zinc-800 flex justify-around items-center lg:hidden">
        {navigationLinks.map((item, index) => (
          <MenuLink
            key={index}
            link={item.link}
            icon={item.icon}
            label={item.label}
            isMobile={true}
          />
        ))}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-56">
        <div className="flex h-full flex-col border-r border-zinc-800 bg-black/95 p-6 backdrop-blur-md">
          <div className="mb-8">
            <h1 className="bg-gradient-to-r from-[#21eb00] to-emerald-500 bg-clip-text text-2xl font-bold text-transparent">
              DASHBOARD
            </h1>
          </div>
          <nav className="space-y-4">
            {navigationLinks.map((item, index) => (
              <MenuLink
                key={index}
                link={item.link}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-6 mx-4">
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
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 bg-black pt-16 lg:pt-0">
        <div className="mx-auto max-w-full p-4">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;