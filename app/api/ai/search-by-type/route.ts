import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, labels, types, users } from "@/db/schema";
import { sql, eq, and } from "drizzle-orm";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

// Define types
interface AISuggestion {
  title: string;
  reason: string;
}

// Define the response schema for AI suggestions
const suggestionsSchema = z.object({
  suggestions: z.array(
    z.object({
      title: z.string(),
      reason: z.string(),
    })
  ),
});

/**
 * Category-specific AI-powered search endpoint
 * Searches only within posts of a specific type/category
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, typeId } = body;

    // Validation
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Search query is required and must be a non-empty string",
        },
        { status: 400 }
      );
    }

    if (!typeId || typeof typeId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Category ID (typeId) is required",
        },
        { status: 400 }
      );
    }

    const trimmedQuery = query.trim();

    // Verify type exists
    const typeResult = await db
      .select()
      .from(types)
      .where(eq(types.id, typeId))
      .limit(1);

    if (typeResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    const categoryName = typeResult[0].name;

    // Database search - find posts in this category matching the query
    const searchResults = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        excerpt: posts.excerpt,
        coverImage: posts.coverImage,
        createdAt: posts.createdAt,
        label: labels.name,
        type: types.name,
        author: users.name,
      })
      .from(posts)
      .leftJoin(labels, sql`${posts.labelId} = ${labels.id}`)
      .leftJoin(types, sql`${posts.typeId} = ${types.id}`)
      .leftJoin(users, sql`${posts.authorId} = ${users.id}`)
      .where(
        and(
          eq(posts.typeId, typeId),
          sql`
            ${posts.title} ILIKE ${"%" + trimmedQuery + "%"} OR
            ${posts.excerpt} ILIKE ${"%" + trimmedQuery + "%"} OR
            ${posts.content} ILIKE ${"%" + trimmedQuery + "%"} OR
            ${labels.name} ILIKE ${"%" + trimmedQuery + "%"}
          `
        )
      )
      .limit(10);

    // Get AI suggestions
    let suggestions: AISuggestion[] = [];

    try {
      // Use AI to generate smart suggestions based on category
      const response = await generateObject({
        model: google("gemini-2.0-flash"),
        schema: suggestionsSchema,
        prompt: `You are a helpful assistant for the "${categoryName}" category of our blog.

User is searching for: "${trimmedQuery}"

Available articles in the "${categoryName}" category:
${searchResults.map((post) => `- "${post.title}": ${post.excerpt}`).join("\n")}

Based on this search query, provide 3-4 helpful article suggestions from our "${categoryName}" category that readers interested in "${trimmedQuery}" would find most relevant.

Each suggestion should include:
1. The exact title of an article from our database (must be from the results above or related to the category)
2. A brief reason why it would be helpful for this search

Return JSON with a "suggestions" array.`,
      });

      suggestions = response.object.suggestions || [];
    } catch (aiError) {
      console.error("AI suggestion error:", aiError);
      // Continue without AI suggestions if there's an error
      suggestions = [];
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          results: searchResults,
          suggestions: suggestions,
          totalResults: searchResults.length,
          categoryName: categoryName,
        },
        message: "Category search completed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error performing category search:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to perform search",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
