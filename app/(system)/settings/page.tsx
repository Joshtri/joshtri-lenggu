"use client";

import { Tabs, Tab } from "@heroui/react";
import SiteSettings from "@/components/features/settings/site";
import MaintenanceSettings from "@/components/features/settings/maintenance";
import CommentSettings from "@/components/features/settings/comments";
import EmailSettings from "@/components/features/settings/email";
import ContentSettings from "@/components/features/settings/content";
import SocialMediaSettings from "@/components/features/settings/social";
import {
  Mail,
  MessageSquareText,
  Settings,
  TriangleAlert,
  FileText,
  Users,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your blog configuration and preferences
          </p>
        </div>

        <div className="flex w-full flex-col lg:flex-row gap-6">
          <Tabs
            aria-label="Settings options"
            isVertical
            classNames={{
              base: "w-full lg:flex-1 flex flex-col lg:flex-row",
              tabList:
                "gap-2 w-full lg:w-64 relative rounded-lg p-2 bg-white dark:bg-gray-800 shadow-sm",
              cursor: "bg-primary-100 dark:bg-primary-900/20",
              tab: "max-w-full px-4 h-12 justify-start",
              tabContent:
                "group-data-[selected=true]:text-primary-600 dark:group-data-[selected=true]:text-primary-400",
              panel:
                "flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 w-full",
            }}
          >
            <Tab
              key="site"
              title={
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  <span>Site Settings</span>
                </div>
              }
            >
              <SiteSettings />
            </Tab>
            <Tab
              key="maintenance"
              title={
                <div className="flex items-center gap-3">
                  <TriangleAlert className="w-5 h-5" />
                  <span>Maintenance</span>
                </div>
              }
            >
              <MaintenanceSettings />
            </Tab>
            <Tab
              key="comments"
              title={
                <div className="flex items-center gap-3">
                  <MessageSquareText className="w-5 h-5" />
                  <span>Comments</span>
                </div>
              }
            >
              <CommentSettings />
            </Tab>
            <Tab
              key="email"
              title={
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </div>
              }
            >
              <EmailSettings />
            </Tab>
            <Tab
              key="content"
              title={
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <span>Content</span>
                </div>
              }
            >
              <ContentSettings />
            </Tab>
            <Tab
              key="social"
              title={
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span>Social Media</span>
                </div>
              }
            >
              <SocialMediaSettings />
            </Tab>
          </Tabs>
        </div>

        {/* Info Box */}
        <div className="mt-6 max-w-7xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Settings Info
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                Changes are saved immediately when you click Save Changes
                button.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
