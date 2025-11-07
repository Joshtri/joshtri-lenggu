"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Type {
  id: string;
  name: string;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  createdAt: Date | null;
}

interface PostReadViewProps {
  post: Post;
  type: Type;
  slug: string;
}

export default function PostReadView({
  post,
  type,
  slug,
}: PostReadViewProps) {
  const router = useRouter();

  // Calculate reading time
  const readingTime = Math.ceil(
    post.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200
  );

  // Format date
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header Section */}
      <section className="border-b-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            isIconOnly
            variant="light"
            onPress={() => router.back()}
            className="mb-6 text-gray-900 dark:text-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Link href={`/${slug}`} className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              {type.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100">{post.title}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-6 italic">
              {post.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative w-full h-96 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose dark:prose-invert max-w-none">
          <div
            className="text-gray-800 dark:text-gray-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </section>

      {/* Footer Section */}
      <section className="border-t-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                More from {type.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Explore more articles in this category
              </p>
            </div>
            <Link href={`/${slug}`}>
              <Button
                color="primary"
                variant="flat"
              >
                View Category
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
