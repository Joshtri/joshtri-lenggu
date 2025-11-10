"use client";

import { useState, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import * as LucideIcons from "lucide-react";
import { Input, Card, CardBody, ScrollShadow, Chip, Button } from "@heroui/react";
import { Search, X, Sparkles } from "lucide-react";

interface IconSelectorProps {
  name: string;
  label?: string;
  required?: boolean;
  errorMessage?: string;
}

// Popular icons for quick access
const POPULAR_ICONS = [
  "Home", "User", "Settings", "Mail", "Phone", "Calendar", "Clock", "Heart",
  "Star", "Search", "Plus", "Minus", "Check", "X", "ChevronRight", "ChevronLeft",
  "ChevronUp", "ChevronDown", "Menu", "MoreVertical", "MoreHorizontal", "Edit",
  "Trash2", "Download", "Upload", "Share2", "Link", "ExternalLink", "File",
  "Folder", "Image", "Video", "Music", "Code", "Terminal", "Github", "Twitter",
  "Facebook", "Instagram", "Linkedin", "Youtube", "MessageCircle", "Bell",
  "AlertCircle", "Info", "HelpCircle", "Lock", "Unlock", "Eye", "EyeOff",
];

export function IconSelector({
  name,
  label = "Icon",
  required = false,
  errorMessage,
}: IconSelectorProps) {
  const { control } = useFormContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopular, setShowPopular] = useState(true);

  // Get all Lucide icons automatically
  const allIcons = useMemo(() => {
    // List of known non-icon exports to exclude
    const excludedKeys = new Set([
      "createLucideIcon",
      "default",
      "icons",
      "Icon",
      "LucideProps",
      "LucideIcon",
    ]);

    // Get all icon names from lucide-react package
    const iconEntries = Object.entries(LucideIcons).filter(
      ([key, value]) => {
        // Must be a function (React component)
        if (typeof value !== "function") return false;

        // Exclude known non-icon exports
        if (excludedKeys.has(key)) return false;

        // Exclude icon aliases with "Icon" suffix (e.g., "HomeIcon" - we only want "Home")
        if (key.endsWith("Icon")) return false;

        // Icon components start with uppercase letter
        if (!/^[A-Z]/.test(key)) return false;

        return true;
      }
    );

    const iconNames = iconEntries.map(([name]) => name).sort();
    console.log(`✅ Loaded ${iconNames.length} Lucide icons automatically`);

    // Log first few icons for debugging
    if (iconNames.length > 0) {
      console.log("First 10 icons:", iconNames.slice(0, 10));
    } else {
      console.warn("⚠️ No icons loaded! Check lucide-react package.");
      console.log("Available exports:", Object.keys(LucideIcons).slice(0, 20));
    }

    return iconNames;
  }, []);

  // Filter icons based on search query
    const filteredIcons = useMemo(() => {
      const isSearching = !!searchQuery.trim();
      const effectiveShowPopular = showPopular && !isSearching;
  
      if (!isSearching) {
        return effectiveShowPopular
          ? POPULAR_ICONS.filter((icon) => allIcons.includes(icon))
          : allIcons;
      }
  
      const query = searchQuery.toLowerCase();
      const filtered = allIcons.filter((iconName) =>
        iconName.toLowerCase().includes(query)
      );
  
      return filtered;
    }, [allIcons, searchQuery, showPopular]);

  // Render icon component
  const renderIcon = (iconName: string) => {
    try {
      const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
      if (!IconComponent) return null;
      return <IconComponent className="w-6 h-6" />;
    } catch (error) {
      console.error(`Failed to render icon: ${iconName}`, error);
      return null;
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {/* Selected Icon Display */}
          {field.value && (
            <Card className="border-2 border-primary shadow-sm">
              <CardBody className="flex flex-row items-center gap-3 p-4">
                <div className="text-primary flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                  {renderIcon(field.value)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {field.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Currently selected icon
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => field.onChange("")}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 rounded-md transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              </CardBody>
            </Card>
          )}

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<Search className="w-4 h-4 text-gray-400" />}
                endContent={
                  searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )
                }
                classNames={{
                  input: "text-sm",
                  inputWrapper: "border border-gray-300 dark:border-gray-600",
                }}
              />
            </div>
            <Button
              size="sm"
              variant={showPopular && !searchQuery ? "solid" : "bordered"}
              color={showPopular && !searchQuery ? "primary" : "default"}
              onPress={() => {
                setShowPopular(!showPopular);
                setSearchQuery("");
              }}
              startContent={<Sparkles className="w-4 h-4" />}
              isDisabled={!!searchQuery}
            >
              {showPopular ? "Popular" : "All Icons"}
            </Button>
          </div>

          {/* Info Chip */}
          <div className="flex items-center justify-between">
            <Chip size="sm" variant="flat" color="default">
              {searchQuery
                ? `${filteredIcons.length} results`
                : showPopular
                ? `${filteredIcons.length} popular icons`
                : `${filteredIcons.length} total icons`}
            </Chip>
            {showPopular && !searchQuery && (
              <button
              type="button"
                onClick={() => setShowPopular(false)}
                className="text-xs text-primary hover:underline"
              >
                Show all {allIcons.length} icons →
              </button>
            )}
          </div>

          {/* Icon Grid */}
          <ScrollShadow className="h-[400px] border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950">
            {filteredIcons.length > 0 ? (
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 p-3">
                {filteredIcons.map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => field.onChange(iconName)}
                    className={`
                      group relative flex items-center justify-center aspect-square rounded-lg border-2 transition-all
                      hover:border-primary hover:bg-primary/10 hover:scale-105
                      ${
                        field.value === iconName
                          ? "border-primary bg-primary/20 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:shadow-sm"
                      }
                    `}
                    title={iconName}
                  >
                    <div className={`
                      ${field.value === iconName ? "text-primary" : "text-gray-600 dark:text-gray-400"}
                    `}>
                      {renderIcon(iconName)}
                    </div>
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                      {iconName}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  No icons found
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Try a different search term
                </p>
              </div>
            )}
          </ScrollShadow>

          {errorMessage && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errorMessage}
            </p>
          )}
        </div>
      )}
    />
  );
}
