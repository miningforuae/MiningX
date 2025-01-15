
// @ts-nocheck

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import legalContent from './legalContent';

const LegalModal = ({ title, content }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="block text-gray-300 transition-all duration-300 hover:pl-2 hover:text-green-500">
          {title}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          {content}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" },
  ];

  

  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Shop", href: "/shop" },
        { label: "Contact", href: "/contactUs" },
      ],
    },
    {
      title: "Legal",
      links: Object.keys(legalContent).map((label) => ({
        label,
        isModal: true,
      })),
    },
  ];

  return (
    <footer className="bg-[#101010] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="mb-12 grid gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl font-bold">Miner</span>
              <div className="-ml-2 flex h-8 w-7 items-center justify-center rounded-full bg-green-500">
                <span className="text-xl font-bold">X</span>
              </div>
            </Link>
            <p className="mb-6 leading-relaxed text-gray-300">
              Empowering businesses with innovative technology solutions. We
              bridge the gap between cutting-edge digital experiences and
              real-world impact.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="group text-gray-400 transition-colors hover:text-green-500"
                >
                  <social.icon className="h-6 w-6 transition-transform group-hover:scale-110" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="col-span-2 grid grid-cols-2 gap-8">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h4 className="mb-4 text-lg font-semibold text-green-500">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.isModal ? (
                        <LegalModal
                          title={link.label}
                          content={legalContent[link.label]}
                        />
                      ) : (
                        <Link
                          href={link.href}
                          className="block text-gray-300 transition-all duration-300 hover:pl-2 hover:text-green-500"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-800 pt-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="mb-4 text-sm text-gray-400 md:mb-0">
              © {new Date().getFullYear()} MinerX Technologies. All Rights
              Reserved.
            </p>

          
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="mb-2 text-xl font-bold text-white">
                Join Our Community
              </h3>
              <p className="text-sm text-gray-400">
                Subscribe for exclusive updates, insights, and special offers
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-l-lg bg-gray-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 md:w-64"
              />
              <button className="rounded-r-lg bg-green-500 px-6 py-3 text-sm text-white transition-colors hover:bg-green-600">
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
