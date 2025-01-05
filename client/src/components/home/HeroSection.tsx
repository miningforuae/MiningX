"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const CreativeHeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      title: 'ASIC MINERS',
      subtitle: 'HOSTING SERVICES',
      description: '97% Uptime guaranteed ASIC Mining with cheapest electricity cost of just 0.065 $ / KW for b2b.',
      image: '/header2.png', // Replace with your mining rig image
      stats: [
        { label: 'Uptime', value: '97%' },
        { label: 'Power Cost', value: '0.065$/KW' },
        { label: 'Support', value: '24/7' }
      ]
    },
    {
      title: 'MINING SOLUTIONS',
      subtitle: 'CLOUD MINING',
      description: 'Professional mining solutions with advanced monitoring and optimal performance.',
      image: '/header1.png', // Replace with your second image
      stats: [
        { label: 'Security', value: '99.9%' },
        { label: 'Efficiency', value: '95%' },
        { label: 'ROI', value: 'High' }
      ]
    },
    {
      title: 'DATA CENTERS',
      subtitle: 'PREMIUM HOSTING',
      description: 'State-of-the-art facilities with advanced cooling systems and optimal mining conditions.',
      image: '/header2.png', // Replace with your third image
      stats: [
        { label: 'Cooling', value: 'Advanced' },
        { label: 'Location', value: 'Strategic' },
        { label: 'Scale', value: 'Enterprise' }
      ]
    }
  ];

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#101010] overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 border border-green-500 transform rotate-45"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${10 + Math.random() * 10}s infinite linear`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative h-full max-w-[1440px] mx-auto flex">
        {/* Left Content Section */}
        <div className="w-full lg:w-1/2 h-full flex items-center px-8 lg:px-16 z-10 md:-mt-40 -mt-96 ">
          <div className="max-w-xl">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 absolute ${
                  index === currentSlide 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Animated Line */}
                <div className="w-20 h-1 bg-green-500 mb-8 animate-width" />
                
                {/* Title Section */}
                <div className="space-y-4 mb-8">
                  <h2 className="text-green-500 text-xl tracking-wider animate-slideUp">
                    {slide.title}
                  </h2>
                  <h1 className="text-white text-5xl font-bold leading-tight animate-slideUp">
                    {slide.subtitle}
                  </h1>
                  <p className="text-gray-400 text-lg animate-slideUp">
                    {slide.description}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {slide.stats.map((stat, i) => (
                    <div 
                      key={i}
                      className="animate-slideUp"
                      style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                    >
                      <div className="text-green-500 text-2xl font-bold mb-1">
                        {stat.value}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="group flex items-center space-x-2 bg-green-500 hover:bg-green-600 
                  text-white px-8 py-4 rounded-full transition-all duration-300 animate-slideUp">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image Section */}
        <div className="hidden lg:block w-1/2 h-full relative overflow-hidden -mt-12">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 transform
                ${index === currentSlide ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            >
              {/* Image Container with Clip Path */}
              <div className="relative h-full clip-path-slant bg-[#151515]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-75"
                />
                {/* Green Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent" />
                
                {/* Animated Patterns */}
                <div className="absolute inset-0">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-16 h-16 border border-green-500/20"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                        animation: `pulse ${3 + Math.random() * 2}s infinite`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-8 lg:left-16 z-20 flex items-center space-x-4">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full border border-gray-600 hover:border-green-500 
              transition-colors duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => !isAnimating && setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 
                  ${index === currentSlide ? 'w-8 bg-green-500' : 'bg-gray-600'}`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full border border-gray-600 hover:border-green-500 
              transition-colors duration-300"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

// Add these styles to your global CSS
const styles = `
@keyframes float {
  0% { transform: translate(0, 0) rotate(45deg); }
  50% { transform: translate(-20px, 20px) rotate(45deg); }
  100% { transform: translate(0, 0) rotate(45deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.2; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.4; }
}

@keyframes slideUp {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes width {
  0% { width: 0; }
  100% { width: 5rem; }
}

.clip-path-slant {
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
}

.animate-width { animation: width 0.8s ease-out forwards; }
.animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
`;

export default CreativeHeroSlider;