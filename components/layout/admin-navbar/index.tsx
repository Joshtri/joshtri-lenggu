"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { Search, Menu, Sun, Moon } from "lucide-react";
import { Button, Input } from "@heroui/react";
import UserSkeleton from "@/components/features/profile/components/UserSkeleton";
import { Text } from "@/components/ui/Text";
import { NotificationGrid } from "@/components/features/notifications/NotificationGrid";
import { useState, useEffect } from "react";

interface AdminNavbarProps {
  /**
   * Callback function when menu button is clicked (opens sidebar on mobile)
   */
  onMenuClick: () => void;
  /**
   * Callback function to toggle sidebar collapse (desktop only)
   */
  onToggleCollapse?: () => void;
  /**
   * Loading state for the navbar
   * @default false
   */
  isLoading?: boolean;
}

export function AdminNavbar({
  onMenuClick,
  onToggleCollapse,
  isLoading = false,
}: AdminNavbarProps) {
  const { user, isLoaded } = useUser();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return savedTheme === "dark" || (!savedTheme && prefersDark);
  });

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDark && !htmlElement.classList.contains("dark")) {
      htmlElement.classList.add("dark");
    } else if (!isDark && htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark");

    // Save preference
    if (newIsDark) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left: Menu button (mobile) */}
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            className="lg:hidden"
            onPress={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search Bar (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Desktop Menu Button - Toggles sidebar collapse */}
            {onToggleCollapse && (
              <Button
                isIconOnly
                variant="light"
                className="hidden lg:flex text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                onPress={onToggleCollapse}
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <Input
              type="text"
              placeholder="Search..."
              className="w-64"
              classNames={{
                input: "dark:text-white",
                inputWrapper: "dark:bg-gray-800 dark:border-gray-700",
              }}
              startContent={
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              }
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search button (mobile only) */}
          <Button
            isIconOnly
            variant="light"
            className="md:hidden text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Theme Toggle */}
          <Button
            isIconOnly
            variant="light"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* Notifications - Role-based rendering (Admin/Visitor) */}
          <NotificationGrid />

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
            {isLoading || !isLoaded ? (
              // Loading state
              <UserSkeleton />
            ) : (
              // Loaded state with user info
              <SignedIn>
                <div className="hidden sm:block text-right">
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.fullName || user?.firstName || "-"}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.primaryEmailAddress?.emailAddress || "-"}
                  </Text>
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </SignedIn>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
