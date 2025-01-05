import Image from "next/image";
import Link from "next/link";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone 
} from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" }
  ];

  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Shop", href: "/shop" },
        { label: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Accessibility", href: "/accessibility" },
        { label: "Cookie Policy", href: "/cookies" }
      ]
    }
  ];

  return (
    <footer className="bg-[#101010] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Brand Section */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                <span className="text-2xl font-bold">W</span>
              </div>
              <span className="text-xl font-bold">wemine</span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering businesses with innovative technology solutions. We bridge the gap between cutting-edge digital experiences and real-world impact.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link 
                  key={index} 
                  href={social.href} 
                  className="text-gray-400 hover:text-green-500 transition-colors group"
                >
                  <social.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 col-span-2 gap-8">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-lg mb-4 text-green-500">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href} 
                        className="text-gray-300 hover:text-green-500 hover:pl-2 transition-all duration-300 block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} Wemine Technologies. All Rights Reserved.
            </p>
            
            <div className="flex space-x-4 text-sm">
              <Link 
                href="/privacy" 
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-600">|</span>
              <Link 
                href="/terms" 
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">
                Join Our Community
              </h3>
              <p className="text-gray-400 text-sm">
                Subscribe for exclusive updates, insights, and special offers
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full md:w-64 px-4 py-3 text-sm rounded-l-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="bg-green-500 text-white px-6 py-3 text-sm rounded-r-lg hover:bg-green-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;