import { NextRequest, NextResponse } from "next/server";
import { getClerkUserList } from "@/lib/clerk";
import { auth } from "@clerk/nextjs/server";

// GET - Fetch all users from Clerk
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const query = searchParams.get("query");
    const orderBy = searchParams.get("orderBy");

    const response = await getClerkUserList({
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
      query: query || undefined,
      orderBy: orderBy || "-created_at",
    });

    // Transform Clerk user data to simpler format
    const users = response.data.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || null,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastSignInAt: user.lastSignInAt,
      emailVerified: user.emailAddresses[0]?.verification?.status === "verified",
    }));

    return NextResponse.json(
      {
        success: true,
        data: users,
        totalCount: response.totalCount,
        message: "Users fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
