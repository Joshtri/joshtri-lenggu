import PostEdit from "@/components/features/posts/edit";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg">
            Invalid post ID
          </p>
        </div>
      </div>
    );
  }

  return <PostEdit postId={id} />;
}
