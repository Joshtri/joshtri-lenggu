"use client";

import React from "react";
import { Text } from "@/components/ui/Text";

/**
 * NotificationVisitor Component
 * Shows a simple info message for non-admin users
 * Visitors don't have access to system notifications
 */
export function NotificationVisitor() {
  return (
    <div className="text-center py-4">
      <Text className="text-sm text-gray-500 dark:text-gray-400">
        Notifications are only available for administrators
      </Text>
    </div>
  );
}
