import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, users, postViews } from "@/db/schema";
import { desc, and, gte, sql } from "drizzle-orm";

/**
 * Admin Notifications API
 * Generates notifications from:
 * 1. New posts (last 7 days)
 * 2. New users (last 7 days)
 * 3. Posts reaching 10+ views (milestone)
 */

// GET - Fetch admin notifications
export async function GET(request: NextRequest) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Get new posts from last 7 days
    const newPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .where(gte(posts.createdAt, sevenDaysAgo))
      .orderBy(desc(posts.createdAt));

    // 2. Get new users from last 7 days
    const newUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(gte(users.createdAt, sevenDaysAgo))
      .orderBy(desc(users.createdAt));

    // 3. Get posts with 10+ views (milestone notification)
    const postsWithMilestone = await db
      .select({
        postId: postViews.postId,
        title: posts.title,
        slug: posts.slug,
        viewCount: sql<number>`count(${postViews.id})`,
      })
      .from(postViews)
      .innerJoin(posts, sql`${postViews.postId} = ${posts.id}`)
      .groupBy(postViews.postId, posts.title, posts.slug)
      .having(sql`count(${postViews.id}) >= 10`)
      .orderBy(desc(sql`count(${postViews.id})`));

    // Combine all notifications
    const notifications = [
      // New posts notifications
      ...newPosts.map((post) => ({
        id: `post-${post.id}`,
        type: "post_created",
        title: `New Post: ${post.title}`,
        message: post.excerpt || "A new blog post has been published",
        timestamp: post.createdAt,
        priority: 2,
      })),

      // New users notifications
      ...newUsers.map((user) => ({
        id: `user-${user.id}`,
        type: "user_joined",
        title: `New User: ${user.name}`,
        message: `${user.email} joined`,
        timestamp: user.createdAt,
        priority: 1,
      })),

      // Posts with 10+ views milestone
      ...postsWithMilestone.map((post) => ({
        id: `milestone-${post.postId}`,
        type: "view_milestone",
        title: `Milestone: ${post.title}`,
        message: `"${post.title}" reached ${post.viewCount} views!`,
        timestamp: new Date(),
        priority: 3,
      })),
    ];

    // Sort by timestamp (newest first)
    notifications.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json(
      {
        success: true,
        data: notifications,
        unreadCount: notifications.length,
        message: "Admin notifications fetched successfully",
        cache: "1h", // Cache for 1 hour
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
      }
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch notifications",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
