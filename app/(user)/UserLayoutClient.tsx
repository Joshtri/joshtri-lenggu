"use client";

import { ReactNode } from "react";
import Navbar from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface UserLayoutClientProps {
  children: ReactNode;
}

export function UserLayoutClient({ children }: UserLayoutClientProps) {
  // Public layout with Navbar and Footer
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
