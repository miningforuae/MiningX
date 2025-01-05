'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import dynamic from 'next/dynamic';

// Define the interface for location props
interface Location {
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Define the interface for map component props
interface MapComponentProps {
  location: Location;
  isExpanded: boolean;
}

// Dynamic import of map components with no SSR
const MapComponent = dynamic<MapComponentProps>(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-800">
      <div className="text-blue-400">Loading map...</div>
    </div>
  )
});

const ContactPage = () => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const location: Location = {
    address: {
      street: "123 Business Street",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Address</h3>
                    <p className="text-gray-400">{location.address.street}</p>
                    <p className="text-gray-400">
                      {`${location.address.city}, ${location.address.state} ${location.address.zip}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-gray-400">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-gray-400">contact@example.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Card */}
          <Card 
            className={`bg-gray-800 border-gray-700 transition-all duration-300 cursor-pointer ${
              isMapExpanded ? 'fixed inset-4 z-50' : ''
            }`}
            onClick={() => setIsMapExpanded(!isMapExpanded)}
          >
            <CardContent className="p-0 relative">
              <div className="absolute top-4 right-4 z-10 bg-gray-800 rounded-full p-2">
                <ExternalLink className="w-6 h-6 text-blue-400" />
              </div>
              <div className={`w-full rounded-lg overflow-hidden ${isMapExpanded ? 'h-full' : 'h-64 md:h-full'}`}>
                <MapComponent 
                  location={location} 
                  isExpanded={isMapExpanded}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;