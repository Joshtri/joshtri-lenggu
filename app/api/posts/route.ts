import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// GET - Fetch all posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const qb = db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .$dynamic();

    if (limit) {
      qb.limit(Number(limit));
    }

    if (offset) {
      qb.offset(Number(offset));
    }

    const allPosts = await qb;

    return NextResponse.json(
      {
        success: true,
        data: allPosts,
        message: "Posts fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch posts",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, coverImage, content, excerpt, authorId, labelId } =
      body;

    // Validation
    if (!slug || !title || !coverImage || !content || !excerpt) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (existingPost.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Post with this slug already exists",
        },
        { status: 409 }
      );
    }

    const newPost = await db
      .insert(posts)
      .values({
        slug,
        title,
        coverImage,
        content,
        excerpt,
        authorId: authorId || null,
        labelId: labelId || null,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newPost[0],
        message: "Post created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create post",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
