import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, labels, types, users } from "@/db/schema";
import { sql, ilike, desc } from "drizzle-orm";
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
 * AI-powered search endpoint that provides:
 * 1. Full-text search results from database
 * 2. AI-generated suggestions based on search query
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Search query is required and must be a non-empty string",
        },
        { status: 400 }
      );
    }

    const trimmedQuery = query.trim();

    // Database search - find posts matching the query
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
        sql`
          ${posts.title} ILIKE ${"%" + trimmedQuery + "%"} OR
          ${posts.excerpt} ILIKE ${"%" + trimmedQuery + "%"} OR
          ${posts.content} ILIKE ${"%" + trimmedQuery + "%"} OR
          ${labels.name} ILIKE ${"%" + trimmedQuery + "%"}
        `
      )
      .orderBy(desc(posts.createdAt))
      .limit(10);

    // Get AI suggestions
    let suggestions: AISuggestion[] = [];

    try {
      // Use AI to generate smart suggestions
      const response = await generateObject({
        model: google("gemini-2.0-flash"),
        schema: suggestionsSchema,
        prompt: `Based on the search query "${trimmedQuery}", provide 3-4 helpful article suggestions that readers might be interested in.

        Available articles in our database:
        ${searchResults.map((post) => `- "${post.title}" (${post.type || "General"}): ${post.excerpt}`).join("\n")}

        Provide suggestions that would be most relevant to someone searching for "${trimmedQuery}". Each suggestion should include:
        1. The exact title of an article from our database (or a topic if no exact match)
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
        },
        message: "Search completed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error performing AI search:", error);
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
