"use client";
import React, { useState, useEffect } from "react";
import {
  Heart,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Share2,
} from "lucide-react";
import { useGetAllMiningMachinesQuery } from "@/lib/feature/Machines/miningMachinesApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Machine {
  _id: string;
  machineName: string;
  priceRange: {
    min: number;
    max: number;
  };
  images?: string[];
}

interface ShopProps {
  isHomePage?: boolean;
  initialProductCount?: number;
  whatsappNumber?: string;
}

const Shop: React.FC<ShopProps> = ({
  isHomePage = false,
  initialProductCount = 6,
}) => {
  const [sortOption, setSortOption] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [animatedProducts, setAnimatedProducts] = useState<Set<string>>(
    new Set(),
  );

  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useGetAllMiningMachinesQuery();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const products = productsResponse as unknown as { data: Machine[] };

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const handleProductClick = (productId: string) => {
    setAnimatedProducts(new Set([...animatedProducts, productId]));
    setTimeout(() => {
      setAnimatedProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 1000);
  };

  const ProductCard = ({ product }: { product: Machine }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isAnimated = animatedProducts.has(product._id);

    return (
      <div
        className={`group relative overflow-hidden rounded-xl bg-primary/20 transition-all duration-300 hover:bg-primary/30 ${
          isAnimated ? "animate-pulse" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="cursor-pointer"
          onClick={() =>
            router.push(
              `/shop/${product.machineName.toLowerCase().replace(/\s+/g, "-")}`,
            )
          }
        >
          <div className="relative ">
            <Image
              src={product.images?.[0] || "/placeholder.jpg"}
              alt={product.machineName}
              height={100}
              width={100}
              className="h-full w-full bg-white "
            />
          </div>

          <div className="space-y-4 bg-black/20 p-6 ">
            <h3 className="text-center text-xl font-bold text-white">
              {product.machineName}
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Price </span>
                <span className="text-lg font-bold text-green-500">
                  ${product.priceRange.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Montly Profit</span>
                <span className="text-lg font-bold text-green-500">
                  ${product.monthlyProfit.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-lg border border-green-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-green-500">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredProducts = (products?.data || [])
    .filter((product) => {
      // Search filter
      if (
        searchTerm &&
        !product.machineName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Price range filter
      if (selectedPriceRange !== "all") {
        const [min, max] = selectedPriceRange.split("-").map(Number);
        if (max) {
          return product.priceRange.min >= min && product.priceRange.min < max;
        } else {
          return product.priceRange.min >= min;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price-low":
          return a.priceRange.min - b.priceRange.min;
        case "price-high":
          return b.priceRange.max - a.priceRange.max;
        default:
          return 0;
      }
    });

  const displayProducts = isHomePage
    ? filteredProducts.slice(0, initialProductCount)
    : filteredProducts;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
          <div className="text-white">Loading products...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="bg-red-500/20 rounded-lg p-6 text-center backdrop-blur-sm">
          <div className="text-red-500 mb-4">⚠️</div>
          <div className="text-white">
            Error loading products. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="container p-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Search mining machines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg bg-primary/20 px-4 py-2 pl-10 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500 lg:w-96"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayProducts.map((product, index) => (
                <ProductCard key={product._id || index} product={product} />
              ))}
            </div>

            {isHomePage && displayProducts.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Link
                  href="/shop"
                  className="rounded-lg bg-green-500 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-green-600"
                >
                  View All Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
