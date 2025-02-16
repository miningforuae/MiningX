"use client";
import React from 'react';
import { ArrowRight, Phone, Server, Truck, Wrench, ChartBar } from 'lucide-react';

const ImprovedHowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Book a Call with an Advisor to Define your Goals",
      description: "First of all, let's take the time to talk. Book a call with one of our specialist advisors to clearly define your objectives and answer any questions you may have.",
      icon: Phone,
      delay: "0"
    },
    {
      number: "02",
      title: "Choosing & Ordering Your Mining Equipment",
      description: "We guide you in choosing the best machines for your project. Once you've made your choice, we'll take care of the rest.",
      icon: Server,
      delay: "100"
    },
    {
      number: "03",
      title: "Your Machines Are On Their Way",
      description: "Delivery times may vary according to the country you choose, but we'll keep you informed at every stage.",
      icon: Truck,
      delay: "200"
    },
    {
      number: "04",
      title: "Setting Up & Configuring Your Machines",
      description: "When it comes to installation, our team takes care of everything, from installation to configuration, so that your machines are up and running in no time.",
      icon: Wrench,
      delay: "300"
    },
    {
      number: "05",
      title: "Real-Time Performance Monitoring",
      description: "Now, relax and keep track of your machines' performance with our real-time interactive dashboard.",
      icon: ChartBar,
      delay: "400"
    }
  ];

  return (
    <div className="relative w-full bg-[#101010] px-6 py-20">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-16 w-16 transform"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatHexagon ${20 + Math.random() * 10}s infinite linear`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              <div 
                className="h-full w-full border border-green-500"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-24 flex items-center justify-between">
          <div className="relative">
            <h2 className="text-6xl font-bold">
              <span className="text-white">How it </span>
              <span className="bg-gradient-to-r from-green-500 to-green-300 bg-clip-text text-transparent">
                works
              </span>
            </h2>
            <div className="mt-4 h-1 w-24 bg-green-500" />
          </div>

          <button className="group relative overflow-hidden rounded-full bg-green-500 px-8 py-4 text-lg font-medium text-white transition-all hover:bg-green-600">
            <span className="relative z-10 flex items-center space-x-2">
              <span>Talk to an expert</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 -translate-x-full transform bg-green-400 transition-transform group-hover:translate-x-0" />
          </button>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative"
              style={{
                animation: 'fadeInUp 0.6s ease-out forwards',
                animationDelay: `${step.delay}ms`
              }}
            >
              {/* Background Number */}
              <span className="absolute -left-4 -top-16 text-[130px] font-bold text-[#222222] transition-colors group-hover:text-[#2a2a2a]">
                {step.number}
              </span>

              {/* Content Card */}
              <div className="relative z-10 rounded-2xl border border-gray-800 bg-black bg-opacity-50 p-8 transition-all duration-300 hover:border-green-500">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                  <step.icon className="h-6 w-6" />
                </div>

                <h3 className="mb-4 text-2xl font-bold text-white transition-colors group-hover:text-green-400">
                  {step.title}
                </h3>

                <p className="text-gray-400">
                  {step.description}
                </p>

                {/* Decorative Elements */}
                <div className="absolute right-4 top-4 h-20 w-20 rounded-full border border-green-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes floatHexagon {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, 20px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ImprovedHowItWorksSection;