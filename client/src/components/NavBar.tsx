import React, { useState } from "react";
import { Menu, X, Heart, ShoppingCart, RepeatIcon, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "@/lib/store/store";
import { logout, setUser } from "@/lib/feature/auth/authSlice";
import { useGetCurrentUserQuery } from "@/lib/feature/auth/authThunk";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface NavLink {
  label: string;
  href: string;
  onClick?: () => void;

}

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const router = useRouter();

  const { isLoading } = useGetCurrentUserQuery();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(setUser(null));
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userMenuItems: NavLink[] = [
    { label: "Profile", href: "/profile" },

    {
      label: "Logout",
      href: "/",
      onClick: handleLogout,
    },
  ];

  const navLinks: NavLink[] = [
    { label: "HOME", href: "/" },
    { label: "SHOP", href: "/shop" },
    { label: "ABOUT US", href: "/about" },
    { label: "CONTACT US", href: "/contactUs" },
  ];

  return (
    <header className="bg-[#101010] text-white">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-7">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
             
              <span className="text-3xl font-bold">Miner</span>
              <div className="flex -ml-2 h-8 w-7 items-center justify-center rounded-full bg-green-500">
                <span className="text-xl font-bold">X</span>
              </div>
            </Link>
            <div className="relative">
              <div className="flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative pb-2 text-white transition-colors 
                      ${
                        pathname === link.href
                          ? "font-semibold text-green-500 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-green-500"
                          : "hover:text-green-500"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              {/* Bottom Line */}
              <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gray-700"></div>
            </div>
            {/* Main Navigation */}
            <div className="flex items-center space-x-6">
              {isLoading ? (
                <div className="h-6 w-24 animate-pulse rounded bg-gray-700"></div>
              ) : isAuthenticated ? (
                <div className="group relative z-50">
                  <button className="flex items-center space-x-2 transition-colors hover:text-green-500">
                    <User className="h-5 w-5" />
                    <span>{user?.firstName || "My Account"}</span>
                  </button>
                  <div className="invisible absolute right-0 top-full w-48 rounded-md bg-white py-1 shadow-lg group-hover:visible">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={item.onClick}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="transition-colors hover:text-green-500"
                >
                  LOGIN / REGISTER
                </Link>
              )}
              <div className="flex items-center space-x-4">
                {/* <IconWithBadge Icon={Heart} count={0} />
                <IconWithBadge Icon={ShoppingCart} count={0} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-white focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
              <span className="text-xl font-bold">W</span>
            </div>
            <span className="text-lg font-bold">wemine</span>
          </div>

          {/* <IconWithBadge Icon={ShoppingCart} count={0} /> */}
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900">
            <div className="p-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Search for products"
                  className="w-full rounded-lg bg-gray-800 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <nav className="mt-6 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="py-2 text-lg transition-colors hover:text-green-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="my-4 h-px bg-gray-800" />
                <a
                  href="#"
                  className="py-2 transition-colors hover:text-green-500"
                >
                  WISHLIST
                </a>

                <a
                  href="#"
                  className="py-2 transition-colors hover:text-green-500"
                >
                  LOGIN / REGISTER
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};



export default NavBar;
