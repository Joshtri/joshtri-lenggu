import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { types } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET - Fetch single type by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Invalid type ID" },
                { status: 400 }
            );
        }

        const result = await db
            .select()
            .from(types)
            .where(eq(types.id, id))
            .limit(1);

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, message: "Type not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: result[0], message: "Type fetched successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching type:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch type",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// PATCH - Update type (partial update)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Invalid type ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { name, description } = body ?? {};

        // Ensure type exists
        const existing = await db
            .select()
            .from(types)
            .where(eq(types.id, id))
            .limit(1);

        if (existing.length === 0) {
            return NextResponse.json(
                { success: false, message: "Type not found" },
                { status: 404 }
            );
        }

        // Build partial update object
        const updateData: Record<string, unknown> = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;

        const updated = await db
            .update(types)
            .set(updateData)
            .where(eq(types.id, id))
            .returning();

        return NextResponse.json(
            { success: true, data: updated[0], message: "Type updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating type:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update type",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// DELETE - Delete type
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Invalid type ID" },
                { status: 400 }
            );
        }

        // Ensure type exists
        const existing = await db
            .select()
            .from(types)
            .where(eq(types.id, id))
            .limit(1);

        if (existing.length === 0) {
            return NextResponse.json(
                { success: false, message: "Type not found" },
                { status: 404 }
            );
        }

        await db.delete(types).where(eq(types.id, id));

        return NextResponse.json(
            { success: true, message: "Type deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting type:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete type",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
