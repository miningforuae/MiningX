import React from 'react';
import { CircuitBoard, Cpu, Gauge, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative bg-primary min-h-[90vh] overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 h-full w-full">
          {[...Array(144)].map((_, i) => (
            <div key={i} className="border border-white/10" />
          ))}
        </div>
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 overflow-hidden">
        {[Cpu, CircuitBoard, Gauge, Zap].map((Icon, index) => (
          <div
            key={index}
            className={`absolute opacity-20 animate-float-${index + 1}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Icon size={48} className="text-secondary" />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Power Your Future with
            <span className="bg-secondary 400 text-transparent bg-clip-text"> Mining Excellence</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Unleash the potential of blockchain technology with our cutting-edge mining solutions.
            Industry-leading performance meets next-generation efficiency.
          </p>

          {/* Stats section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <Gauge className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">140+ TH/s</h3>
              <p className="text-gray-400">Maximum Hashrate</p>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <Zap className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">98%</h3>
              <p className="text-gray-400">Power Efficiency</p>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <Cpu className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">24/7</h3>
              <p className="text-gray-400">Technical Support</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        
            <button className="px-8 py-4 bg-transparent border border-secondary hover:bg-white/5 text-white font-semibold rounded-lg transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;