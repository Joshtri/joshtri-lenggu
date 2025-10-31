import {
  Home,
  PenSquare,
  Tag,
  BookOpen,
  User,
  Settings,
  InfoIcon,
} from "lucide-react";
import { type ReactNode } from "react";

export interface NavigationItem {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
  description?: string;
}

/**
 * Public menu items - visible to all users
 */
export const publicMenuItems: NavigationItem[] = [
  {
    key: "home",
    label: "Home",
    href: "/",
    icon: <Home className="w-4 h-4" />,
  },
  {
    key: "blog",
    label: "Blog",
    href: "/blog",
    icon: <PenSquare className="w-4 h-4" />,
    description: "Browse all blog",
  },
  {
    key: "about",
    label: "about",
    href: "/about",
    icon: <InfoIcon className="w-4 h-4" />,
    description: "Explore tags",
  },
];

/**
 * System/Private menu items - visible only to authenticated users
 */
export const systemMenuItems: NavigationItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home className="w-4 h-4" />,
    description: "Go to dashboard",
  },
  {
    key: "my-posts",
    label: "My Posts",
    href: "/my-posts",
    icon: <PenSquare className="w-4 h-4" />,
    description: "Manage your posts",
  },
  {
    key: "drafts",
    label: "Drafts",
    href: "/drafts",
    icon: <BookOpen className="w-4 h-4" />,
    description: "View your drafts",
  },
  {
    key: "profile",
    label: "Profile",
    href: "/profile",
    icon: <User className="w-4 h-4" />,
    description: "View your profile",
  },
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: <Settings className="w-4 h-4" />,
    description: "Account settings",
  },
];

/**
 * All navigation items combined
 */
export const allMenuItems: NavigationItem[] = [
  ...publicMenuItems,
  ...systemMenuItems,
];

/**
 * Get menu item by key
 */
export const getMenuItemByKey = (key: string): NavigationItem | undefined => {
  return allMenuItems.find((item) => item.key === key);
};

/**
 * Get public menu items
 */
export const getPublicMenuItems = (): NavigationItem[] => {
  return publicMenuItems;
};

/**
 * Get system/private menu items
 */
export const getSystemMenuItems = (): NavigationItem[] => {
  return systemMenuItems;
};
