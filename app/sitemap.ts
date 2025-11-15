import { MetadataRoute } from "next";
import { db } from "@/db";
import { posts, users } from "@/db/schema";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch all published posts
    const allPosts = await db.select().from(posts);

    // Filter only published posts
    const publishedPosts = allPosts.filter((post) => post.status === "PUBLISHED");

    // Map posts to sitemap entries
    const postEntries: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
      url: `${BASE_URL}/${post.category}/${post.slug}`,
      lastModified: post.updatedAt || post.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: BASE_URL,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${BASE_URL}/about`,
        lastModified: new Date().toISOString(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/auth/login`,
        lastModified: new Date().toISOString(),
        changeFrequency: "yearly" as const,
        priority: 0.5,
      },
      {
        url: `${BASE_URL}/auth/signup`,
        lastModified: new Date().toISOString(),
        changeFrequency: "yearly" as const,
        priority: 0.5,
      },
    ];

    return [...staticPages, ...postEntries];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return at least static pages if database fails
    return [
      {
        url: BASE_URL,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
    ];
  }
}
