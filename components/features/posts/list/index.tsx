"use client";

import { ListGrid } from "@/components/ui/ListGrid";
import { Badge } from "@/components/ui/Badge";
// import type { Post } from "@/interfaces/post.types";
import { useRouter } from "next/navigation";
// import { useDeletePost } from "@/services/posts.service";
import { EyeIcon, PencilIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { Post } from "../interfaces/posts";
import { useDeletePost, usePosts } from "@/services/postsService";
import EmptyState from "@/components/ui/Common/EmptyState";

export function PostList() {
  const router = useRouter();
  const deletePost = useDeletePost();

  // Fetch posts using React Query hook
  const { data, isLoading, isError, error } = usePosts();

  // Extract posts array from API response
  const posts = data?.data || [];

  const columns = [
    {
      key: "id",
      label: "ID",
      value: (post: Post) => post.id,
    },
    {
      key: "coverImage",
      label: "Cover",
      align: "center" as const,
      value: (post: Post) => (
        <Image
          src={post.coverImage}
          alt={post.title}
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-lg"
        />
      ),
    },
    {
      key: "title",
      label: "Title",
      value: (post: Post) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sm">{post.title}</span>
          <span className="text-xs text-gray-500">{post.slug}</span>
        </div>
      ),
    },
    {
      key: "excerpt",
      label: "Excerpt",
      value: (post: Post) => <>{post.excerpt}</>,
    },
    {
      key: "status",
      label: "Status",
      align: "center" as const,
      value: (post: Post) => {
        if (post.deletedAt) {
          return <Badge color="danger">Deleted</Badge>;
        }
        if (post.updatedAt) {
          return <Badge color="warning">Updated</Badge>;
        }
        return <Badge color="success">Published</Badge>;
      },
    },
    {
      key: "createdAt",
      label: "Created",
      value: (post: Post) => (
        <span className="text-xs text-gray-500">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "center" as const,
    },
  ];

  const handleDelete = (id: string) => {
    deletePost.mutateAsync(Number(id)).then(() => {
      // Router refresh will trigger re-fetch from cache
      router.refresh();
    });
  };

  return (
    <ListGrid
      title="Posts Management"
      description="Manage all your blog posts with optimized caching"
      // breadcrumbs={[{ label: "System", href: "/sys" }, { label: "Posts" }]}
      searchPlaceholder="Search posts by title, slug, or excerpt..."
      columns={columns as never} // type fix: cast to any if columns type doesn't match expected Column[]
      onSearch={(query) => {}}
      data={posts}
      isError={isError}
      error={error}
      keyField="id"
      idField="id"
      nameField="title"
      loading={isLoading}
      empty={posts.length === 0}
      addButton={{
        label: "Create Post",
        href: "/posts/create",
        icon: <PlusIcon className="w-4 h-4" />,
      }}
      actionButtons={{
        show: {
          label: "View",
          icon: <EyeIcon className="w-4 h-4" />,
          onClick: (id) => router.push(`/posts/${id}`),
        },
        edit: {
          label: "Edit",
          icon: <PencilIcon className="w-4 h-4" />,
          href: `/posts/`,
        },
        delete: {
          label: "Delete",
          onDelete: handleDelete,
        },
      }}
      deleteConfirmTitle="Delete Post"
      deleteConfirmMessage={(item) =>
        `Are you sure you want to delete "${
          (item as Post).title
        }"? This action cannot be undone.`
      }
      pageSize={10}
      showPagination={true}
    />
  );
}
