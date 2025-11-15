"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
  label: string | null;
  type: string | null;
  author: string | null;
}

export interface AISuggestion {
  title: string;
  reason: string;
}

export interface CategorySearchResponse {
  success: boolean;
  data: {
    results: SearchResult[];
    suggestions: AISuggestion[];
    totalResults: number;
    categoryName: string;
  };
  message: string;
}

interface UseCategorySearchOptions {
  debounceMs?: number;
  typeId?: string;
}

/**
 * Custom hook for category-specific AI-powered search
 * Searches only within a specific blog category/type
 */
export function useCategorySearch(options: UseCategorySearchOptions = {}) {
  const { debounceMs = 300, typeId } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [categoryName, setCategoryName] = useState("");

  // Handle search API call with debouncing
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() || !typeId) {
        setResults([]);
        setSuggestions([]);
        setTotalResults(0);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post<CategorySearchResponse>(
          "/api/ai/search-by-type",
          {
            query: searchQuery,
            typeId: typeId,
          }
        );

        if (response.data.success) {
          setResults(response.data.data.results);
          setSuggestions(response.data.data.suggestions);
          setTotalResults(response.data.data.totalResults);
          setCategoryName(response.data.data.categoryName);
        } else {
          setError(response.data.message || "Search failed");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Category search error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [typeId]
  );

  // Debounced search handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() && typeId) {
        performSearch(query);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, performSearch, typeId]);

  // Keyboard shortcut handler (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      // Close modal with Escape key
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Clear search when modal closes
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setSuggestions([]);
    setError(null);
  }, []);

  // Handle search input change
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  return {
    // State
    isOpen,
    query,
    results,
    suggestions,
    isLoading,
    error,
    totalResults,
    categoryName,

    // Methods
    setIsOpen,
    handleQueryChange,
    handleClose,
    performSearch,
  };
}
