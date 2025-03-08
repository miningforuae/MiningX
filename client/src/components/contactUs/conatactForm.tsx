'use client'

import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface CalendlyWidgetProps {
  calendlyUrl?: string;
  height?: number;
  title?: string;
  subtitle?: string;
}

const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({
  calendlyUrl = "https://calendly.com/miningforuae",
  height = 700,
  title = "Schedule a Meeting",
  subtitle = "Select a convenient time slot and we'll connect with you."
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    document.body.appendChild(script);

    return () => {
      // Clean up on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Ensure the URL has the primary color parameter
  const fullCalendlyUrl = calendlyUrl.includes('?') 
    ? `${calendlyUrl}&primary_color=20e202`
    : `${calendlyUrl}?primary_color=20e202`;

  return (
    <div className="max-w-7xl mx-auto px-4 bg-gray-900 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="max-w-2xl lg:max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4">{title}</h2>
          <p className="text-lg text-gray-400">{subtitle}</p>
        </div>
        
        <div className="bg-[#1E1E1E] p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <div className="flex items-center justify-center mb-8 space-x-4">
            <Calendar className="h-8 w-8 text-[#20e202]" />
            <Clock className="h-8 w-8 text-[#20e202]" />
          </div>
          
          {!isLoaded && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#20e202]"></div>
            </div>
          )}
          
          <div 
            className="calendly-inline-widget" 
            data-url={fullCalendlyUrl}
            style={{ 
              minWidth: '320px', 
              height: `${height}px`,
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
          />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By scheduling a meeting, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendlyWidget;