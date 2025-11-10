"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/Common/PageHeader";
import { usePost } from "@/services/postsService";
import { Heading } from "@/components/ui/Heading";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/ui/Loading/LoadingScreen";

export default function PostShow() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const { data: postData, isLoading, isError } = usePost(String(id));

  if (isError) {
    return (
      <Container>
        <PageHeader title="Post not found" />
      </Container>
    );
  }

  const post = postData?.data;


  return (
    <Container>
      <LoadingScreen isLoading={isLoading} />
      <PageHeader 
        actions={
          <>
            <Button
              size="sm"
              variant="bordered"
              className="dark:border-gray-700 dark:text-gray-200"
              startContent={<EditIcon />}
              isIconOnly
              onPress={() => router.push(`/posts/${post?.id}/edit`)}
            ></Button>
          </>
        }
        title={`Preview Post: ${post?.title}`}
      />
      <Card shadow="sm" className="mt-6 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-col items-start gap-2">
          <Heading className="text-3xl font-bold text-gray-900 dark:text-white">{post?.title}</Heading>
          {post?.excerpt && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">{post.excerpt}</p>
          )}
        </CardHeader>

        {post?.coverImage && (
          <div className="relative w-full h-[400px] bg-gray-200 dark:bg-gray-900">
            <Image
              src={post?.coverImage}
              alt={post?.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}

        <CardBody className="prose dark:prose-invert max-w-none pt-6">
          <article dangerouslySetInnerHTML={{ __html: post?.content || "" }} />
        </CardBody>
      </Card>
    </Container>
  );
}
