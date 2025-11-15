"use client";

import { useEffect, useState } from "react";
import { Progress } from "@heroui/react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
      <Progress
        aria-label="Reading progress"
        value={progress}
        className="w-full h-1 rounded-none"
        classNames={{
          indicator: "bg-gradient-to-r from-blue-600 to-blue-400",
        }}
      />
    </div>
  );
}
