"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import { AdminNavbar } from "../AdminNavbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="">
      <div className="">
        <Header />
        <AdminNavbar/>

        <main>
          <div className="mx-auto max-w-screen-2xl ">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}