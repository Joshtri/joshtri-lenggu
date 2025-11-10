"use client";

import PostForm from "../components/PostForm";

interface PostEditProps {
  postId: string;
}

export default function PostEdit({ postId }: PostEditProps) {
  return <PostForm mode="edit" postId={postId} />;
}
