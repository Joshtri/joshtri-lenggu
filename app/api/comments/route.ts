import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { comments, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// GET - Fetch all comments (with optional filtering by postId)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const postId = searchParams.get("postId");

    let qb = db
      .select({
        id: comments.id,
        content: comments.content,
        authorId: comments.authorId,
        postId: comments.postId,
        parentId: comments.parentId,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        deletedAt: comments.deletedAt,
        author: {
          id: users.id,
          name: users.name,
          image: users.image,
          role: users.role,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .orderBy(desc(comments.createdAt))
      .$dynamic();

    // Filter by postId if provided
    if (postId) {
      qb = qb.where(eq(comments.postId, postId));
    }

    if (limit) {
      qb = qb.limit(Number(limit));
    }

    if (offset) {
      qb = qb.offset(Number(offset));
    }

    const allComments = await qb;

    return NextResponse.json(
      {
        success: true,
        data: allComments,
        message: "Comments fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch comments",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create new comment
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - Please sign in to comment",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, postId, parentId, authorId } = body;

    // Validation
    if (!content || !postId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: content and postId are required",
        },
        { status: 400 }
      );
    }

    // Validate that authorId matches the authenticated user
    if (authorId !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden - Cannot create comment as another user",
        },
        { status: 403 }
      );
    }

    const newComment = await db
      .insert(comments)
      .values({
        content,
        authorId: userId,
        postId,
        parentId: parentId || null,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newComment[0],
        message: "Comment created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create comment",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
