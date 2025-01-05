// components/AdminNavbar.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useAppSelector } from "@/lib/store/reduxHooks";

export const AdminNavbar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const auth = useSelector((state: RootState) => state.auth);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log("AdminNavbar - Full auth state:", {
    user,
    isAuthenticated,
    userRole: user?.role,
    userObject: JSON.stringify(user, null, 2),
  });
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  if (!auth.isAuthenticated || !auth.user || auth.user.role !== "admin") {
    return null;
  }

  return (
    <>
      <header className="w-full flex-col bg-black">
        <nav className="mx-1  items-center justify-between rounded-2xl bg-gray-800 px-6 py-3 shadow-sm md:mx-11 md:flex">
          <div className="flex space-x-3 md:space-x-9">
            <Link
              href="/ProductTable"
              className="font-semibold text-[#21eb00] hover:underline"
            >
              All Product{" "}
            </Link>
            <Link
              href="/AllUser"
              className="text-gray-300 hover:text-[#21eb00]"
            >
              All User
            </Link>
            <Link
              href="/ProductUpload"
              className="text-gray-300 hover:text-[#21eb00]"
            >
              Add Machine{" "}
            </Link>
            <Link href="/Assign" className="text-gray-300 hover:text-[#21eb00]">
              Sign Machine{" "}
            </Link>
            <Link href="/AllTransaction" className="text-gray-300 hover:text-[#21eb00]">
              All Transaction{" "}
            </Link>
          </div>
          <button
            onClick={() => console.log("Logout clicked")}
            className="flex items-center space-x-2 text-[#21eb00] hover:text-green-400"
          ></button>
        </nav>
      </header>
    </>
  );
};
