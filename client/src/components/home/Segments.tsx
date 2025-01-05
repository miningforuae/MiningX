import React from 'react';
import { TrendingUp, Users, Server, Zap } from 'lucide-react';

const ModernAboutSegments = () => {
  const stats = [
    { 
      number: '6+', 
      label: 'Years of Experience',
      icon: <TrendingUp className="w-6 h-6" />
    },
    { 
      number: '300+', 
      label: 'Happy Clients',
      icon: <Users className="w-6 h-6" />
    },
    { 
      number: '20000+', 
      label: 'Machines Sold',
      icon: <Server className="w-6 h-6" />
    },
    { 
      number: '10+', 
      label: 'Power Available (MW)',
      icon: <Zap className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-primary animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16 transition-all duration-300 ease-in-out hover:transform hover:scale-105">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-[#21eb00] to-white bg-clip-text text-transparent mb-4">
            About Segments
          </h1>
          
          <h2 className="text-3xl font-medium text-white mb-8">
            Crypto Mining Company in Dubai, UAE
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-black/40 rounded-2xl p-8 border border-[#21eb00]/20 hover:border-[#21eb00]/50 transition-all duration-300 ease-in-out">
            <p className="text-gray-300 leading-relaxed">
              We have mined Bitcoin for ourselves since 2017. We know the problems you will 
              face in UAE. Procurement, infrastructure, hosting, maintenance, risk 
              management, and financing.
            </p>
          </div>

          <div className="bg-black/40 rounded-2xl p-8 border border-[#21eb00]/20 hover:border-[#21eb00]/50 transition-all duration-300 ease-in-out">
            <p className="text-gray-300 leading-relaxed">
              Our bitcoin mining journey in UAE in the last two years has helped us prepare a 
              much easier path for you, through us! We help you get the most profitable
              <span className="text-[#21eb00] font-medium"> crypto mining machines </span>
              in Dubai at the best rates and host them for you here in the Middle east.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl group hover:transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#21eb00] opacity-90" />
              <div className="relative p-8 flex flex-col items-center justify-center">
                <div className="mb-4 text-[#21eb00] group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <span className="text-4xl font-bold mb-2 text-white">
                  {stat.number}
                </span>
                <span className="text-center text-gray-300 text-sm">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-300 hover:transform hover:scale-105 transition-all duration-300 ease-in-out">
            We help you set up the infrastructure, IoT-based controls, and maintenance. 
            We can even talk to you about risk management and hedging. 
            <span className="block mt-2 text-[#21eb00] font-medium">
              Come visit us at our crypto-hosting center in Abu Dhabi, UAE!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModernAboutSegments;