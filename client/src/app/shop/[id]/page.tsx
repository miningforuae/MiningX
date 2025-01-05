

// @ts-nocheck

"use client"

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetAllMiningMachinesQuery } from "@/lib/feature/Machines/miningMachinesApiSlice";
import { 
  ChevronLeft, 
  ShoppingCart, 
  Heart, 
  Bolt, 
  Zap, 
  CreditCard, 
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import LandingLayout from '@/components/Layouts/LandingLayout';

interface ProductDetailsProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ params, searchParams }) => {
  const [quantity, setQuantity] = useState(1);
  const whatsappNumber = "+1234567890"; // Move this inside the component or to environment variables
  const { data: products, isLoading, isError } = useGetAllMiningMachinesQuery();

  const product = products?.data?.find(
    (p) => p.machineName.toLowerCase().replace(/\s+/g, '-') === params.id
  );

  const handleWhatsAppClick = () => {
    if (!product) return;
    
    const message = `Hi, I'm interested in buying ${quantity} unit(s) of ${product.machineName}.\n\nSpecifications:\n- Hashrate: ${product.hashrate} TH/s\n- Power Consumption: ${product.powerConsumption} W\n- Monthly Profit: $${product.monthlyProfit}\n\nTotal Price: $${product.priceRange * quantity}\n\nPlease provide more information about availability and payment options.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading product details...</div>
      </div>
    );
  }

  if (isError || !product) {
    toast.error("Product not found");
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-xl">
          Error loading product details. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <LandingLayout>
      <div className="min-h-screen bg-primary text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              href="/shop" 
              className="inline-flex items-center text-white hover:text-green-500 transition-colors bg-gray-800/50 px-4 py-2 rounded-lg"
            >
              <ChevronLeft className="mr-2" /> Back to Shop
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 blur-2xl -z-10 group-hover:from-green-500/30 group-hover:to-blue-500/30 transition-all duration-300"></div>
              <img 
                src={product.images?.[0] || '/placeholder.jpg'} 
                alt={product.machineName} 
                className="max-w-full h-auto object-contain z-10 transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                {product.machineName}
              </h1>

              {/* Action Button */}
              <button 
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="font-semibold">Buy Now via WhatsApp</span>
              </button>

              {/* Technical Specifications */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Zap className="mr-2 text-yellow-500" /> Technical Specifications
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg">
                    <Bolt className="text-blue-500 h-8 w-8" />
                    <div>
                      <p className="text-gray-400 text-sm">Hashrate</p>
                      <p className="font-medium text-lg">{product.hashrate} TH/s</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg">
                    <Zap className="text-yellow-500 h-8 w-8" />
                    <div>
                      <p className="text-gray-400 text-sm">Power Consumption</p>
                      <p className="font-medium text-lg">{product.powerConsumption} W</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg">
                    <CheckCircle2 className="text-green-500 h-8 w-8" />
                    <div>
                      <p className="text-gray-400 text-sm">Monthly Profit</p>
                      <p className="font-medium text-lg text-green-500">${product.monthlyProfit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-700/30 p-4 rounded-lg">
                    <Heart className="text-red-500 h-8 w-8" />
                    <div>
                      <p className="text-gray-400 text-sm">Coins Mined</p>
                      <p className="font-medium text-lg">{product.coinsMined}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-semibold mb-4">Product Description</h2>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default ProductDetails;