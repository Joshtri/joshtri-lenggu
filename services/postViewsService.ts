"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/interfaces/api";

interface ViewResponse {
  viewsCount: number;
}

// Record a view for a post by slug
async function recordPostView(slug: string): Promise<ApiResponse<ViewResponse>> {
  const { data } = await apiClient.post<ApiResponse<ViewResponse>>(
    `/post-views`,
    { slug }
  );
  return data;
}

// Hook: Record post view (fire-and-forget)
export function useRecordPostView() {
  return useMutation({
    mutationFn: recordPostView,
    retry: 1, // Retry once on failure
    // No toast notifications for views (silent operation)
  });
}

// React hook to automatically track view on mount
export function useTrackPostView(slug: string, enabled: boolean = true) {
  const { mutate } = useRecordPostView();

  // Track view on component mount
  React.useEffect(() => {
    if (typeof window !== "undefined" && enabled && slug) {
      // Use setTimeout to avoid blocking render
      const timer = setTimeout(() => {
        mutate(slug);
      }, 1000); // Wait 1 second before recording (ensures real visit)

      return () => clearTimeout(timer);
    }
  }, [slug, enabled, mutate]);
}
