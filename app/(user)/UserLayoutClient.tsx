"use client";

import { ReactNode } from "react";

interface UserLayoutClientProps {
  children: ReactNode;
}

export function UserLayoutClient({ children }: UserLayoutClientProps) {
  // Simple wrapper - no sidebar, just clean content
  // The main navbar from app/layout.tsx will be used
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
