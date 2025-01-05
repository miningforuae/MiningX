import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen  mx-8">
      {/* Main container */}
      <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between">
        {/* Left side with image */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative w-full h-[500px]">
            {/* Green glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-transparent rounded-full filter blur-3xl"></div>
            {/* Bitcoin image container */}
            <div className="relative h-full w-full rounded-2xl overflow-hidden">
              <Image
                src="/about.png"
                alt="Bitcoin in cave"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right side with content */}
        <div className="w-full md:w-1/2 mt-8 md:mt-0 md:pl-12  py-4">
          <div className="space-y-6">
            <h2 className="text-green-500 font-medium">Welcome to WeMine</h2>
            <h1 className="text-4xl md:text-3xl font-bold text-white leading-tight">
              Your Gateway to Crypto Mining Success
            </h1>
            <p className="text-gray-300 ">
              Whether you&lsquo;re a seasoned miner or a beginner venturing into crypto mining, 
              we are your trusted partner. Based in Dubai, we cater to the needs of crypto 
              miners in the region and beyond. Our mission is to make cryptocurrency mining 
              accessible to all, including beginners looking to explore this exciting field.
            </p>
            <p className="text-gray-300 text-lg">
              At WeMine, we specialize in providing cutting-edge crypto mining machines 
              and accessories to unlock the full potential of cryptocurrency mining.
            </p>
            <div className="pt-4">
              <p className="text-gray-300 text-lg">
                Embark on your <span className="text-white font-semibold">crypto miners UAE</span> journey 
                with confidence, guided by our expertise and top-of-the-line equipment designed 
                for optimal performance and success.
              </p>
            </div>

         
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;