import { NextRequest, NextResponse } from "next/server";
import { getClerkUser } from "@/lib/clerk";
import { auth } from "@clerk/nextjs/server";

// GET - Fetch single user by ID from Clerk
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const user = await getClerkUser(id);

    // Transform Clerk user data to simpler format
    const userData = {
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
      phoneNumbers: user.phoneNumbers.map((phone) => ({
        phoneNumber: phone.phoneNumber,
        verified: phone.verification?.status === "verified",
      })),
      externalAccounts: user.externalAccounts.map((account) => ({
        provider: account.provider,
        emailAddress: account.emailAddress,
      })),
    };

    return NextResponse.json(
      {
        success: true,
        data: userData,
        message: "User fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);

    // Check if user not found
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
