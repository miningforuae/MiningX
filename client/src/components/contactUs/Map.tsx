import React from 'react';
import { MapPin, Clock, Mail, Phone } from 'lucide-react';

const LocationSection = () => {
  return (
    <section className="bg-[#121212] text-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl lg:max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Visit Our Location</h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Discover our convenient location in the heart of the city, designed to serve you better.
          </p>
        </div>
        <div className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
  <iframe
    className="absolute top-0 left-0 w-full h-full"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11672.945750644447!2d-122.42107853750231!3d37.7730507907087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858070cc2fbd55%3A0xa71491d736f62d5c!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sus!4v1619524992238!5m2!1sen!2sus"
    loading="lazy"
  ></iframe>
</div>


          {/* Location Details */}
          <div className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 divide-y divide-gray-800">
            {/* Address Section */}
            <div className="px-6 py-6 flex items-center space-x-4">
              <MapPin className="text-[#20e202] w-10 h-10" />
              <div>
                <h3 className="text-xl font-semibold text-white">Our Address</h3>
                <p className="text-gray-400 mt-1">123 Main St, San Francisco, CA 94105</p>
              </div>
            </div>

            {/* Hours Section */}
            <div className="px-6 py-6 flex items-center space-x-4">
              <Clock className="text-[#20e202] w-10 h-10" />
              <div>
                <h3 className="text-xl font-semibold text-white">Hours</h3>
                <div className="text-gray-400 mt-1">
                  <p>Monday - Friday: 9am - 5pm</p>
                  <p>Saturday: 10am - 4pm</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="px-6 py-6 flex items-center space-x-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <Mail className="text-[#20e202] w-10 h-10" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">Email</h3>
                    <p className="text-gray-400">info@example.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="text-[#20e202] w-10 h-10" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">Phone</h3>
                    <p className="text-gray-400">+1 (234) 567-8900</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;