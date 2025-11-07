import { notFound } from "next/navigation";
import { db } from "@/db";
import { types, posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { textToSlug } from "@/lib/slug";
import CategoryView from "@/components/features/category/CategoryView";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Find type by slug
  const typeList = await db.select().from(types);
  const type = typeList.find(
    (t) => textToSlug(t.name) === slug
  );

  if (!type) {
    notFound();
  }

  // Fetch posts for this type
  const postList = await db
    .select()
    .from(posts)
    .where(eq(posts.typeId, type.id));

  return (
    <CategoryView
      type={type}
      posts={postList}
      slug={slug}
    />
  );
}
