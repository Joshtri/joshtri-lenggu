"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

export default function AuthButtons() {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-9 h-9",
          },
        }}
      />
    );
  }

  return (
    <div
      className="hidden md:flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Login Button - Always visible */}
      <Button
        variant="bordered"
        className="text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 h-10 font-medium"
        onClick={() => router.push("/auth/login")}
        startContent={<LogIn className="w-4 h-4" />}
      >
        Login
      </Button>

      {/* Sign Up Button - Slides in from left on hover */}
      <Button
        variant="bordered"
        className={`text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 h-10 font-medium transition-all duration-300 ${
          isHovered
            ? "opacity-100 w-auto px-4"
            : "opacity-0 w-0 px-0 overflow-hidden border-0"
        }`}
        onClick={() => router.push("/auth/signup")}
        startContent={isHovered ? <UserPlus className="w-4 h-4" /> : null}
      >
        {isHovered && "Sign Up"}
      </Button>
    </div>
  );
}
