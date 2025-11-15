"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useNotifications } from "@/providers/NotificationProvider";
import { NotificationItem } from "./NotificationItem";
import { Text } from "@/components/ui/Text";

/**
 * NotificationAdmin Component
 * Shows admin notifications (new posts, new users, view milestones)
 * Only visible to ADMIN users
 */
export function NotificationAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
  } = useNotifications();

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          isIconOnly
          variant="light"
          className="relative text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Admin Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Notification badge - shows unread count */}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] sm:w-80 md:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-0">
        <div className="flex flex-col">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
              System Notifications
            </Text>
            {/* {unreadCount > 0 && (
              <Button
                size="sm"
                variant="light"
                className="text-xs text-blue-500 dark:text-blue-400 hover:underline p-0 h-auto"
                onPress={() => markAsRead("")}
              >
                Clear
              </Button>
            )} */}
          </div>

          {/* Notifications List - Scrollable */}
          <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <Text className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                  Loading...
                </Text>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <Text className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                  No notifications yet
                </Text>
              </div>
            ) : (
              <div className="space-y-1.5 sm:space-y-2 p-3 sm:p-4">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer - Fixed */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
              <Text className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Notifications auto-clear after 7 days
              </Text>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
