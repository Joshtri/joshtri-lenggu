"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useNotifications } from "@/providers/NotificationProvider";
import { NotificationItem } from "./NotificationItem";
import { Text } from "@/components/ui/Text";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          isIconOnly
          variant="light"
          className="relative text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Notifications"
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
      <PopoverContent className="w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-4 p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Text className="font-semibold text-gray-900 dark:text-white">
              Notifications
            </Text>
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="light"
                className="text-xs text-blue-500 dark:text-blue-400 hover:underline p-0 h-auto"
                onPress={markAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                Loading...
              </Text>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                No notifications yet
              </Text>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
          )}

          {/* Footer */}
          {notifications.length > 0 && (
            <Button
              fullWidth
              size="sm"
              variant="light"
              className="text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"
            >
              View all notifications
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
