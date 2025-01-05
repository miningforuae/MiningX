"use client";
import React, { useState, ReactNode } from "react";
import Header from "@/components/Header";
import Navbar from "../NavBar";
import Footer from "@/components/home/Footer";
import { AdminNavbar } from "../AdminNavbar";
import FloatingWhatsApp from "../home/whatApp";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className="bg-black-2" >
      <AdminNavbar/>
      <FloatingWhatsApp phoneNumber="YOUR_PHONE_NUMBER" />

       <Navbar/>
       <div >
         
          <main>
            <div >
              {children}
            </div>
          </main>
          <Footer/>
        </div>
      </div>
    </>
  );
}
