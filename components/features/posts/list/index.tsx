"use client";

import { ListGrid, Columns } from "@/components/ui/ListGrid";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import { Post } from "../interfaces/posts";
import { useDeletePost } from "@/services/postsService";
import {
  ACTION_BUTTONS,
  ADD_BUTTON,
} from "@/components/ui/Button/ActionButtons";

export function PostList() {
  const deletePost = useDeletePost();

  // Type-safe columns - simple & clean!
  const columns: Columns<Post> = [
    {
      key: "id",
      label: "ID",
      value: (post) => post.id,
    },
    {
      key: "coverImage",
      label: "Cover",
      align: "center" as const,
      value: (post) => (
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
      value: (post) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sm">{post.title}</span>
          <span className="text-xs text-gray-500">{post.slug}</span>
        </div>
      ),
    },
    {
      key: "excerpt",
      label: "Excerpt",
      value: (post) => <>{post.excerpt}</>,
    },
    {
      key: "viewsCount",
      label: "Views",
      align: "center" as const,
      value: (post) => <>{post.viewsCount}</>,
    },
    {
      key: "status",
      label: "Status",
      align: "center" as const,
      value: (post) => {
        const statusMap = {
          draft: { color: "warning" as const, label: "Draft" },
          published: { color: "success" as const, label: "Published" },
          archived: { color: "default" as const, label: "Archived" },
        };
        const status = statusMap[post.status] || statusMap.published;
        return <Badge color={status.color}>{status.label}</Badge>;
      },
    },
    {
      key: "createdAt",
      label: "Created",
      value: (post) => (
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
    return deletePost.mutateAsync(id);
  };

  return (
    <ListGrid<Post>
      title="Posts Management"
      description="Manage all your blog posts with optimized caching"
      searchPlaceholder="Search posts by title, slug, or excerpt..."
      columns={columns}
      onSearch={(_query: string) => {}}
      resourcePath="/posts"
      nameField="title"
      actionButtons={{
        add: ADD_BUTTON.CREATE("/posts/create"),
        show: ACTION_BUTTONS.SHOW("/posts"),
        edit: ACTION_BUTTONS.EDIT("/posts"),
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
      deleteConfirmTitle="Delete Post"
      deleteConfirmMessage={(post) =>
        `Are you sure you want to delete "${post.title}"? This action cannot be undone.`
      }
      pageSize={10}
      showPagination={true}
    />
  );
}
