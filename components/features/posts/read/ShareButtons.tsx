"use client";

import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: "hover:bg-blue-400 hover:text-white",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "hover:bg-blue-700 hover:text-white",
    },
  ];

  return (
    <div className="sticky top-32 space-y-3 lg:flex lg:flex-col">
      <div className="flex lg:flex-col gap-3 lg:gap-3 justify-center lg:justify-start">
        {shareLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center w-12 h-12 rounded-lg border-1 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 transition-all ${link.color}`}
              aria-label={`Share on ${link.name}`}
              title={link.name}
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center w-12 h-12 rounded-lg border-1 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          aria-label="Copy link"
          title={copied ? "Copied!" : "Copy Link"}
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <Link2 className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
