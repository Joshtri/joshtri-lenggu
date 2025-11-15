"use client";

import React from "react";
import { Button } from "@heroui/react";
import { X, FileText, UserPlus, TrendingUp, Info } from "lucide-react";
import { Text } from "@/components/ui/Text";
import { Notification } from "@/providers/NotificationProvider";
import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => Promise<void>;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "post_created":
        return <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
      case "user_joined":
        return <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case "view_milestone":
        return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />;
      default:
        return <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "post_created":
        return "border-l-4 border-l-blue-500";
      case "user_joined":
        return "border-l-4 border-l-green-500";
      case "view_milestone":
        return "border-l-4 border-l-orange-500";
      default:
        return "border-l-4 border-l-gray-500";
    }
  };

  const handleMarkAsRead = async () => {
    await onMarkAsRead(notification.id);
  };

  return (
    <div
      className={`p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${getNotificationColor(
        notification.type
      )}`}
    >
      <div className="flex items-start gap-2">
        {/* Icon */}
        <div className="shrink-0 mt-0.5 sm:mt-1">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 ">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Text className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-2">
                {notification.title}
              </Text>
              <Text className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5 sm:mt-1">
                {notification.message}
              </Text>
              <Text className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-0.5 sm:mt-1">
                {formatDistanceToNow(new Date(notification.timestamp), {
                  addSuffix: true,
                })}
              </Text>
            </div>

            {/* Close button */}
            {/* <div className="shrink-0">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="w-5 h-5 sm:w-6 sm:h-6 min-w-fit"
                onPress={() => handleMarkAsRead()}
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500" />
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
