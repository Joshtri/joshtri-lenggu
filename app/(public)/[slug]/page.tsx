import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/db";
import { types, posts, labels } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { textToSlug } from "@/lib/slug";
import CategoryView from "@/components/features/category/CategoryView";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Find type by slug
  const typeList = await db.select().from(types);
  const type = typeList.find((t) => textToSlug(t.name) === slug);

  if (!type) {
    return {
      title: "Category Not Found",
      description: "The category you are looking for does not exist.",
    };
  }

  const categoryDescription = type.description || `Explore articles in the ${type.name} category`;

  return {
    title: `${type.name} | Joshtri Lenggu Blog`,
    description: categoryDescription,
    keywords: `${type.name}, blog, technology, learning`,
    openGraph: {
      title: type.name,
      description: categoryDescription,
      type: "website",
      url: `${BASE_URL}/${slug}`,
      siteName: "Joshtri Lenggu Blog",
      images: [
        {
          url: `${BASE_URL}/joshtri-lenggu-solid.png`,
          width: 192,
          height: 192,
          alt: `${type.name} Category`,
        },
        {
          url: `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${type.name} - Joshtri Lenggu Blog`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: type.name,
      description: categoryDescription,
      images: [`${BASE_URL}/og-image.jpg`],
      creator: "@joshtrilenggu",
    },
    alternates: {
      canonical: `${BASE_URL}/${slug}`,
    },
  };
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

  // Fetch posts for this type (only published) with label data
  const postList = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      content: posts.content,
      coverImage: posts.coverImage,
      authorId: posts.authorId,
      labelId: posts.labelId,
      typeId: posts.typeId,
      status: posts.status,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      deletedAt: posts.deletedAt,
      viewsCount: posts.viewsCount,
      label: {
        id: labels.id,
        name: labels.name,
        color: labels.color,
        description: labels.description,
      },
    })
    .from(posts)
    .leftJoin(labels, eq(posts.labelId, labels.id))
    .where(and(eq(posts.typeId, type.id), eq(posts.status, 'published')));

  return (
    <CategoryView
      type={type}
      posts={postList}
      slug={slug}
    />
  );
}
