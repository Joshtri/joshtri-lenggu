import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema/posts.schema";
import { users } from "@/db/schema/users.schema";
import { labels } from "@/db/schema/labels.schema";
import { comments } from "@/db/schema/comments.schema";
import { sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics (counts and trends)
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get current date for monthly calculations
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Execute all queries in parallel for better performance
    const [
      totalPostsResult,
      totalUsersResult,
      totalLabelsResult,
      totalCommentsResult,
      currentMonthPostsResult,
      lastMonthPostsResult,
      currentMonthUsersResult,
      lastMonthUsersResult,
    ] = await Promise.all([
      // Total counts
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(posts)
        .where(sql`${posts.deletedAt} IS NULL`),
      
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(sql`${users.deletedAt} IS NULL`),
      
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(labels)
        .where(sql`${labels.deletedAt} IS NULL`),
      
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(comments)
        .where(sql`${comments.deletedAt} IS NULL`),

      // Current month posts
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(posts)
        .where(sql`${posts.createdAt} >= ${firstDayOfMonth} AND ${posts.deletedAt} IS NULL`),

      // Last month posts
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(posts)
        .where(
          sql`${posts.createdAt} >= ${firstDayOfLastMonth} AND ${posts.createdAt} <= ${lastDayOfLastMonth} AND ${posts.deletedAt} IS NULL`
        ),

      // Current month users
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(sql`${users.createdAt} >= ${firstDayOfMonth} AND ${users.deletedAt} IS NULL`),

      // Last month users
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(
          sql`${users.createdAt} >= ${firstDayOfLastMonth} AND ${users.createdAt} <= ${lastDayOfLastMonth} AND ${users.deletedAt} IS NULL`
        ),
    ]);

    // Extract counts
    const totalPosts = totalPostsResult[0]?.count || 0;
    const totalUsers = totalUsersResult[0]?.count || 0;
    const totalLabels = totalLabelsResult[0]?.count || 0;
    const totalComments = totalCommentsResult[0]?.count || 0;
    const currentMonthPosts = currentMonthPostsResult[0]?.count || 0;
    const lastMonthPosts = lastMonthPostsResult[0]?.count || 0;
    const currentMonthUsers = currentMonthUsersResult[0]?.count || 0;
    const lastMonthUsers = lastMonthUsersResult[0]?.count || 0;

    // Calculate percentage changes
    const postsChange = lastMonthPosts > 0 
      ? ((currentMonthPosts - lastMonthPosts) / lastMonthPosts) * 100 
      : currentMonthPosts > 0 ? 100 : 0;

    const usersChange = lastMonthUsers > 0
      ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
      : currentMonthUsers > 0 ? 100 : 0;

    // Calculate uptime (simple mock - you can implement real monitoring)
    const uptime = 99.5;

    return NextResponse.json({
      success: true,
      data: {
        posts: {
          total: totalPosts,
          change: Number(postsChange.toFixed(1)),
          trend: postsChange >= 0 ? "up" : "down",
          currentMonth: currentMonthPosts,
          lastMonth: lastMonthPosts,
        },
        users: {
          total: totalUsers,
          change: Number(usersChange.toFixed(1)),
          trend: usersChange >= 0 ? "up" : "down",
          currentMonth: currentMonthUsers,
          lastMonth: lastMonthUsers,
        },
        labels: {
          total: totalLabels,
        },
        comments: {
          total: totalComments,
        },
        uptime: {
          percentage: uptime,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard statistics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
