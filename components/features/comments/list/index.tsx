"use client";

import { ListGrid } from "@/components/ui/ListGrid";
import { useComments } from "@/services/commentsService";
import React from "react";
import { Comment } from "../interfaces/comments";

export default function CommentList() {
  const { data: commentData, isLoading } = useComments();

  // const comments = commentData?.data;

  const columns = [
    {
      key: "content",
      label: "Name",
      render: (comments: Comment) => <span>{comments.content}</span>,
    },

    {
      key: "postId",
      label: "Postingan",
      render: (comments: Comment) => <span>{comments.postId}</span>,
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (comments: Comment) => (
        <span className="text-xs text-gray-500">
          {new Date(comments.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];
  return (
    <>
      <ListGrid
        title={"Comment Lists"}
        data={commentData}
        columns={columns}
        onSearch={(query) => {}}
        searchPlaceholder="Search comment by content, posts title ..."
      />
    </>
  );
}
