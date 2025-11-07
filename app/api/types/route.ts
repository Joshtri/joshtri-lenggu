import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { types } from "@/db/schema";
import { desc } from "drizzle-orm";

// GET - Fetch all types
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = searchParams.get("limit");
        const offset = searchParams.get("offset");

        const qb = db
            .select()
            .from(types)
            .orderBy(desc(types.createdAt))
            .$dynamic();

        if (limit) qb.limit(Number(limit));
        if (offset) qb.offset(Number(offset));

        const allTypes = await qb;

        return NextResponse.json(
            {
                success: true,
                data: allTypes,
                message: "Types fetched successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching types:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch types",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// POST - Create new type
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description } = body ?? {};

        if (!name) {
            return NextResponse.json(
                { success: false, message: "Missing required field: name" },
                { status: 400 }
            );
        }

        const newType = await db
            .insert(types)
            .values({ name, description: description ?? null })
            .returning();

        return NextResponse.json(
            {
                success: true,
                data: newType[0],
                message: "Type created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating type:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create type",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
