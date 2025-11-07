import { clerkClient } from "@clerk/nextjs/server";

/**
 * Fetch user list from Clerk with pagination and filters
 */
export async function getClerkUserList(params?: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  query?: string;
  emailAddress?: string[];
  organizationId?: string[];
}) {
  const client = await clerkClient();

  const response = await client.users.getUserList({
    limit: params?.limit || 10,
    offset: params?.offset || 0,
    orderBy: params?.orderBy || "-created_at",
    query: params?.query,
    emailAddress: params?.emailAddress,
    organizationId: params?.organizationId,
  });

  return response;
}

/**
 * Get single user from Clerk by ID
 */
export async function getClerkUser(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return user;
}
