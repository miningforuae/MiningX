// @ts-nocheck

"use client";

import React, { useEffect, useState } from "react";
import { useGetAllMiningMachinesQuery } from "@/lib/feature/Machines/miningMachinesApiSlice";
import {
  ChevronLeft,
  ShoppingCart,
  Bolt,
  Zap,
  CreditCard,
  CheckCircle2,
  DollarSign,
  Minus,
  Plus,
  Wallet,
  PieChart,
} from "lucide-react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import LandingLayout from "@/components/Layouts/LandingLayout";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { AppDispatch, RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { purchaseAndAssignMachine } from "@/lib/feature/userMachine/transactionSlice";
import PurchaseConfirmationModal from "@/components/shop/confirmModal";
import { purchaseSpecialShares, getSpecialShareMachine } from "@/lib/feature/shareMachine/shareMachineSlice";
import { getUserBalance } from "@/lib/feature/userMachine/balanceSlice";

const ProductDetails = ({ params }) => {
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shareQuantity, setShareQuantity] = useState(1);
  const [isShareRoute, setIsShareRoute] = useState(false);

  const { data: products, isLoading: productsLoading } = useGetAllMiningMachinesQuery();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  
  const balanceData = useSelector((state: RootState) => state.balance.userBalance);
  const { specialMachine, loading: shareLoading } = useSelector(
    (state: RootState) => state.shareMachine
  );

  // Determine if we're on a share-based machine route
  useEffect(() => {
    // Check if the URL contains 'share' parameter
    if (params.id.includes("share")) {
      setIsShareRoute(true);
      dispatch(getSpecialShareMachine());
    } else if (specialMachine && specialMachine.machineName.toLowerCase().replace(/\s+/g, "-") === params.id) {
      // If we already have the special machine and it matches the URL, just set the route type
      setIsShareRoute(true);
    }
  }, [params.id, dispatch]);

  // Initial data fetch for special machine if needed
  useEffect(() => {
    if (!specialMachine && isShareRoute) {
      dispatch(getSpecialShareMachine());
    }
  }, [dispatch, specialMachine, isShareRoute]);
  
  // Get the appropriate product based on whether it's a share route or regular machine
  const product = isShareRoute 
    ? specialMachine 
    : products?.data?.find(p => p.machineName.toLowerCase().replace(/\s+/g, "-") === params.id);

  // Fetch user balance when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(getUserBalance(user.id));
    }
  }, [isAuthenticated, user, dispatch]);

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
      // Check if it's a share-based machine or regular machine
      if (isShareRoute || product.isShareBased) {
        // Purchase shares using share-specific logic
        const sharePurchasePayload = {
          userId: userId,
          numberOfShares: parseInt(shareQuantity, 10)
        };

        const resultAction = await dispatch(
          purchaseSpecialShares(sharePurchasePayload)
        );
        
        if (purchaseSpecialShares.fulfilled.match(resultAction)) {
          toast.success("Share purchase successful!");
          setIsModalOpen(false);
          // Refresh user balance after purchase
          dispatch(getUserBalance(userId));
        } else {
          console.error("Share purchase failed:", resultAction.error);
          const errorMessage =
            resultAction.error?.message || "Share purchase failed. Please try again.";
          toast.error(errorMessage);
        }
      } else {
        // Regular machine purchase - always quantity of 1
        const purchasePayload = {
          userId: userId,
          machineId: product._id,
          quantity: 1, // Always 1 for regular machines
          machineDetails: product,
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
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("An unexpected error occurred during purchase");
    } finally {
      setIsProcessing(false);
    }
  };

  const isShareMachine = isShareRoute || product?.isShareBased;
  const sharePrice = product?.sharePrice || 0;
  const availableShares = product?.availableShares || 0;
  const profitPerShare = product?.profitPerShare || 0;

  const handleQuantityChange = (newQuantity) => {
    if (isShareMachine) {
      if (newQuantity >= 1 && newQuantity <= availableShares) {
        setShareQuantity(newQuantity);
      }
    }
    // Removed handling for non-share machines
  };

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
              ${(balanceData?.balances?.total || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400"></div>
          </div>
        </div>
      </div>
    );

  // Show loading screen while data is loading
  const isLoading = productsLoading || (isShareRoute && shareLoading);
  if (isLoading) {
    return (
      <LandingLayout>
        <div className="flex min-h-screen items-center justify-center bg-primary">
          <div className="text-xl text-white">
            Loading machine details...
          </div>
        </div>
      </LandingLayout>
    );
  }

  // Show error if product not found
  if (!product) {
    return (
      <LandingLayout>
        <div className="flex min-h-screen items-center justify-center bg-primary">
          <div className="text-xl text-white">
            Machine not found. Please try again later.
          </div>
        </div>
      </LandingLayout>
    );
  }

  // Calculate the appropriate price and total based on machine type
  const unitPrice = isShareMachine ? sharePrice : product.priceRange;
  const totalPrice = isShareMachine 
    ? sharePrice * shareQuantity 
    : product.priceRange; // For normal machines, always quantity of 1
  
  return (
    <LandingLayout>
<ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
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
            <div className="rounded-3xl border max-h-[600px] p-8 bg-white">
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
                {isShareMachine ? (
                  <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                    Share Based Machine
                  </Badge>
                ) : (
                  <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                    In Stock
                  </Badge>
                )}
                <h1 className={`bg-gradient-to-r ${isShareMachine ? 'from-purple-400 to-blue-500' : 'from-green-400 to-blue-500'} bg-clip-text text-4xl font-bold text-transparent`}>
                  {product.machineName}
                </h1>
                {isShareMachine && (
                  <div className="rounded-lg bg-blue-500/20 p-3 text-blue-300">
                    <div className="flex items-center mb-2">
                      <PieChart className="mr-2 h-5 w-5 text-purple-400" />
                      <span className="font-semibold">Share-Based Mining</span>
                    </div>
                    <p className="text-sm">
                      This is a share-based machine. Instead of purchasing the entire machine,
                      you can buy shares and earn proportional profit.
                    </p>
                  </div>
                )}
              </div>

              {/* Price and Quantity Section */}
              <div className={`rounded-2xl border border-gray-700/30 ${isShareMachine ? 'bg-purple-900/20' : 'bg-gray-800/60'} p-6 backdrop-blur-xl`}>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">
                        {isShareMachine ? "Price per share" : "Price"}
                      </p>
                      <p className={`text-3xl font-bold ${isShareMachine ? 'text-purple-400' : 'text-green-400'}`}>
                        ${unitPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm text-gray-400">Total Price</p>
                      <p className={`text-2xl font-semibold ${isShareMachine ? 'text-purple-400' : 'text-green-400'}`}>
                        ${totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls - only for share machines */}
                  {isShareMachine && (
                    <div className="flex items-center justify-between rounded-xl bg-gray-700/30 p-4">
                      <span className="text-gray-300">Share Quantity:</span>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleQuantityChange(shareQuantity - 1)}
                          className="rounded-lg bg-gray-600/50 p-2 transition-colors hover:bg-gray-600"
                          disabled={shareQuantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-[2rem] text-center text-xl font-semibold">
                          {shareQuantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(shareQuantity + 1)}
                          className="rounded-lg bg-gray-600/50 p-2 transition-colors hover:bg-gray-600"
                          disabled={shareQuantity >= availableShares}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Share-specific details */}
              {isShareMachine && (
                <div className="rounded-2xl border border-gray-700/30 bg-purple-900/20 p-6 backdrop-blur-xl">
                  <h2 className="mb-4 flex items-center text-xl font-semibold">
                    <DollarSign className="mr-2 text-purple-400" /> Share Investment Details
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between p-3 rounded-lg bg-gray-700/30">
                      <span>Total Shares:</span>
                      <span className="font-medium">{product.totalShares}</span>
                    </div>
                
                    <div className="flex justify-between p-3 rounded-lg bg-gray-700/30">
                      <span>Profit per share (monthly):</span>
                      <span className="font-medium text-purple-400">${profitPerShare}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-gray-700/30">
                      <span>Your shares:</span>
                      <span className="font-medium">{shareQuantity}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-gray-700/30">
                      <span>Expected monthly profit:</span>
                      <span className="font-medium text-purple-400">
                        ${(profitPerShare * shareQuantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleBuyClick}
                  className={`flex flex-1 transform items-center justify-center gap-3 rounded-xl ${
                    isShareMachine 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 shadow-purple-500/20' 
                      : 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/20'
                  } px-6 py-4 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                    isShareMachine
                      ? 'hover:from-purple-600 hover:to-blue-700'
                      : 'hover:from-green-600 hover:to-green-700'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-semibold">
                    {isShareMachine ? "Buy Shares" : "Buy Now"}
                  </span>
                </button>
               
              </div>

              {/* Technical Specifications */}
              <div className={`rounded-2xl border border-gray-700/30 ${isShareMachine ? 'bg-purple-900/20' : 'bg-gray-800/60'} p-6 backdrop-blur-xl`}>
                <h2 className="mb-4 flex items-center text-xl font-semibold">
                  <Zap className={`mr-2 ${isShareMachine ? 'text-blue-400' : 'text-yellow-400'}`} /> Technical
                  Specifications
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-700/30 p-4 transition-colors hover:bg-gray-700/40">
                    <Bolt className="h-8 w-8 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Hashrate</p>
                      <p className="font-medium">{product.hashrate}</p>
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
                    <DollarSign className={`h-8 w-8 ${isShareMachine ? 'text-purple-400' : 'text-green-400'}`} />
                    <div>
                      <p className="text-sm text-gray-400">
                        {isShareMachine ? "Profit per Share" : "Monthly Profit"}
                      </p>
                      <p className={`font-medium ${isShareMachine ? 'text-purple-400' : 'text-green-400'}`}>
                        ${isShareMachine ? profitPerShare : product.monthlyProfit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-700/30 p-4 transition-colors hover:bg-gray-700/40">
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
        quantity={isShareMachine ? shareQuantity : 1} // Always 1 for normal machines
        isShareMachine={isShareMachine}
        sharePrice={sharePrice}
        profitPerShare={profitPerShare}
        balances={{
          total: balanceData?.balances?.total || 0,
          available: balanceData?.balances?.total || 0
        }}
        isProcessing={isProcessing}
      />
    </LandingLayout>
  );
};

export default ProductDetails;