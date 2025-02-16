"use client";

import React, { useEffect, useState } from "react";
import { useGetAllMiningMachinesQuery } from "@/lib/feature/Machines/miningMachinesApiSlice";
import {
  ChevronLeft,
  ShoppingCart,
  Heart,
  Bolt,
  Zap,
  CreditCard,
  CheckCircle2,
  DollarSign,
  Minus,
  Plus,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import LandingLayout from "@/components/Layouts/LandingLayout";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { purchaseAndAssignMachine } from "@/lib/feature/userMachine/transactionSlice";
import PurchaseConfirmationModal from "@/components/shop/confirmModal";
import { purchaseShares } from "@/lib/feature/shareMachine/shareMachineSlice";
import { getUserBalance } from "@/lib/feature/userMachine/balanceSlice";

const ProductDetails = ({ params }) => {
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shareQuantity, setShareQuantity] = useState(1);

  const { data: products, isLoading, isError } = useGetAllMiningMachinesQuery();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const balanceData = useSelector((state: RootState) => state.balance.userBalance);

  
  const product = products?.data?.find(
    (p) => p.machineName.toLowerCase().replace(/\s+/g, "-") === params.id,
  );

  const handleBuyClick = () => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to make a purchase");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to make a purchase");
      return;
    }

    // Use user.id instead of user._id
    const userId = user?.id; // This matches your user data structure

    if (!userId) {
      toast.error("User ID is missing");
      return;
    }

    if (!product?._id) {
      toast.error("Machine ID is missing");
      return;
    }

    setIsProcessing(true);
    try {
      const purchasePayload = {
        userId: userId, // Use the correct user ID
        machineId: product._id,
        quantity: parseInt(quantity, 10),
        machineDetails: product, // Optional: pass full machine details
      };

      const resultAction = await dispatch(
        purchaseAndAssignMachine(purchasePayload),
      );

      if (purchaseAndAssignMachine.fulfilled.match(resultAction)) {
        toast.success("Purchase successful!");
        setIsModalOpen(false);
      } else {
        console.error("Purchase failed:", resultAction.error);
        const errorMessage =
          resultAction.error?.message || "Purchase failed. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("An unexpected error occurred during purchase");
    } finally {
      setIsProcessing(false);
    }
  };

  const isShareMachine = product?.isShareBased;
  const sharePrice = product?.sharePrice || 0;
  const availableShares = product?.availableShares || 0;
  const profitPerShare = product?.profitPerShare || 0;

  const handleQuantityChange = (newQuantity) => {
    if (isShareMachine) {
      if (newQuantity >= 1 && newQuantity <= availableShares) {
        setShareQuantity(newQuantity);
      }
    } else {
      if (newQuantity >= 1) {
        setQuantity(newQuantity);
      }
    }
  };


  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(getUserBalance(user.id));
    }
  }, [isAuthenticated, user, dispatch]);


  const BalanceDisplay = () =>
    isAuthenticated && (
      <div className="mb-6 rounded-xl border border-gray-700/30 bg-gray-800/60 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="text-green-400" />
            <span className="text-gray-300">Your Balance:</span>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-green-400">
            
              ${(
                balanceData?.balances?.total ||
                0
              ).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400"></div>
          </div>
        </div>
      </div>
    );

    
  if (isError || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="text-xl text-white">
          Error loading product details. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <LandingLayout>
      <div className="min-h-screen bg-gradient-to-b from-primary to-primary/95 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center rounded-xl bg-gray-800/60 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:text-green-400"
            >
              <ChevronLeft className="mr-2" /> Back to Shop
            </Link>
          </div>

          <BalanceDisplay />

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Product Image */}
            <div className="rounded-3xl border max-h-[600px]  p-8 bg-white">
              <div className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-white opacity-0 transition-opacity duration-300 "></div>
                <Image
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.machineName}
                  className="h-auto w-full transform rounded-2xl object-contain transition-transform duration-300 group-hover:scale-105"
                  width={700}
                  height={700}
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                  In Stock
                </Badge>
                <h1 className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
                  {product.machineName}
                </h1>
              </div>

              {/* Price and Quantity Section */}
              <div className="rounded-2xl border border-gray-700/30 bg-gray-800/60 p-6 backdrop-blur-xl">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Price per unit</p>
                      <p className="text-3xl font-bold text-green-400">
                        ${product.priceRange.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm text-gray-400">Total Price</p>
                      <p className="text-2xl font-semibold text-green-400">
                        ${(product.priceRange * quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between rounded-xl bg-gray-700/30 p-4">
                    <span className="text-gray-300">Quantity:</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="rounded-lg bg-gray-600/50 p-2 transition-colors hover:bg-gray-600"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-[2rem] text-center text-xl font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="rounded-lg bg-gray-600/50 p-2 transition-colors hover:bg-gray-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleBuyClick}
                  className="flex flex-1 transform items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-white shadow-lg shadow-green-500/20 transition-all duration-300 hover:scale-[1.02] hover:from-green-600 hover:to-green-700"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-semibold">Buy Now</span>
                </button>
                <button className="rounded-xl bg-gray-700/30 p-4 transition-colors hover:bg-gray-700/50">
                  <Heart className="h-6 w-6" />
                </button>
              </div>

              {/* Technical Specifications */}
              <div className="rounded-2xl border border-gray-700/30 bg-gray-800/60 p-6 backdrop-blur-xl">
                <h2 className="mb-4 flex items-center text-xl font-semibold">
                  <Zap className="mr-2 text-yellow-400" /> Technical
                  Specifications
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-700/30 p-4 transition-colors hover:bg-gray-700/40">
                    <Bolt className="h-8 w-8 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Hashrate</p>
                      <p className="font-medium">{product.hashrate} TH/s</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-700/30 p-4 transition-colors hover:bg-gray-700/40">
                    <Zap className="h-8 w-8 text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-400">Power</p>
                      <p className="font-medium">
                        {product.powerConsumption} W
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-700/30 p-4 transition-colors hover:bg-gray-700/40">
                    <DollarSign className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Monthly Profit</p>
                      <p className="font-medium text-green-400">
                        ${product.monthlyProfit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-700/30 p-4 transition-colors hover:bg-gray-700/40">
                    <Heart className="text-red-400 h-8 w-8" />
                    <div>
                      <p className="text-sm text-gray-400">Coins Mined</p>
                      <p className="font-medium">{product.coinsMined}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-2xl border border-gray-700/30 bg-gray-800/60 p-6 backdrop-blur-xl">
                <h2 className="mb-4 text-xl font-semibold">
                  Product Description
                </h2>
                <p className="leading-relaxed text-gray-300">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PurchaseConfirmationModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onConfirm={handleConfirmPurchase}
    product={product}
    quantity={quantity}
    balances={{
      // The logs show balanceData.balances.total is the correct path
      total: balanceData?.balances?.total || 0,
      available: balanceData?.balances?.total || 0
    }}
    isProcessing={isProcessing}
  />
    </LandingLayout>
  );
};

export default ProductDetails;
