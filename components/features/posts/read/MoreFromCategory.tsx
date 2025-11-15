"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Text } from "@/components/ui/Text";
import { Heading } from "@/components/ui/Heading";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  viewsCount?: number;
}

interface MoreFromCategoryProps {
  type: {
    id: string;
    name: string;
  };
  slug: string;
  posts?: Post[];
}

export default function MoreFromCategory({
  type,
  slug,
  posts = [],
}: MoreFromCategoryProps) {
  return (
    <section className="border-t-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Heading className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              More from {type.name}
            </Heading>
            <Text className="text-gray-600 dark:text-gray-400 text-sm">
              Explore more articles in this category
            </Text>
          </div>
          <Link href={`/${slug}`}>
            <Button color="primary" variant="flat">
              View Category
            </Button>
          </Link>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/${slug}/${post.slug}`}
                className="group"
              >
                <div className="h-full rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/50 flex flex-col bg-white dark:bg-gray-800">
                  {/* Cover Image */}
                  {post.coverImage && (
                    <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <Heading className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </Heading>
                      <Text className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                        {post.excerpt}
                      </Text>
                    </div>

                    {/* Views Count */}
                    {post.viewsCount !== undefined && post.viewsCount > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <Text className="text-xs text-gray-500 dark:text-gray-500">
                          {post.viewsCount.toLocaleString()} views
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Text className="text-gray-600 dark:text-gray-400">
              No more articles in this category yet.
            </Text>
          </div>
        )}
      </div>
    </section>
  );
}
