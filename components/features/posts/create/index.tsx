"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { PageHeader } from "@/components/ui/Common/PageHeader";
import RichTextEditor, {
  type RichTextEditorHandle,
} from "@/components/ui/TextEditor";
import { TextInput } from "@/components/ui/Inputs/TextInput";
import { TextareaInput } from "@/components/ui/Inputs/TextareaInput";
import { Button } from "@heroui/react";
import { Save, X, FileText, Type, Clock, Calendar } from "lucide-react";
// import { useCreatePost } from "@/services/posts/postsService";
import { CreatePostInput } from "../interfaces/posts";
import { useCreatePost } from "@/services/postsService";

type PostFormData = {
  title: string;
  slug: string;
  coverImage: string;
  content: string;
  excerpt: string;
  authorId?: number;
  labelId?: number;
};

export default function PostCreate() {
  const router = useRouter();
  const editorRef = useRef<RichTextEditorHandle>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const methods = useForm<PostFormData>({
    defaultValues: {
      title: "",
      slug: "",
      coverImage: "",
      content: "",
      excerpt: "",
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  const createPost = useCreatePost();

  // Watch fields
  const watchedTitle = watch("title");
  const watchedContent = watch("content");

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [watchedTitle, setValue]);

  // Count words, characters, and estimate reading time
  useEffect(() => {
    if (watchedContent) {
      const text = watchedContent.replace(/<[^>]*>/g, "");
      const words = text.split(/\s+/).filter((word) => word.length > 0);
      const wordCount = words.length;
      const charCount = text.length;
      const readingTime = Math.ceil(wordCount / 200);

      setWordCount(wordCount);
      setCharCount(charCount);
      setReadingTime(readingTime);
    }
  }, [watchedContent]);

  const handleContentChange = (content: string) => {
    setValue("content", content, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      // Get the latest content from editor
      const latestContent = editorRef.current?.getContent() || data.content;

      if (
        !latestContent ||
        latestContent.replace(/<[^>]*>/g, "").trim().length === 0
      ) {
        return;
      }

      const postData: CreatePostInput = {
        title: data.title,
        slug: data.slug,
        coverImage: data.coverImage,
        content: latestContent,
        excerpt: data.excerpt,
        authorId: data.authorId,
        labelId: data.labelId,
      };

      await createPost.mutateAsync(postData);
      router.push("/sys/posts");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Use state to avoid SSR mismatch
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      })
    );
  }, []);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Create New Post"
        description="Start writing content that inspires and share it with the world."
        actions={
          <>
            {isDirty && (
              <span className="text-xs bg-orange-100 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-md flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                Unsaved
              </span>
            )}
            <Button
              variant="bordered"
              size="sm"
              isDisabled={isSubmitting}
              onPress={() => router.push("/sys/posts")}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              size="sm"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
              startContent={!isSubmitting && <Save className="h-4 w-4" />}
            >
              {isSubmitting ? "Saving..." : "Save Post"}
            </Button>
          </>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Editor Column - Left Side */}
              <div className="lg:col-span-2 space-y-6">
                {/* Editor Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Content Editor
                    </h3>
                  </div>
                  <div className="p-0">
                    <div
                      className={`border-0 rounded-lg overflow-hidden ${
                        errors.content ? "ring-2 ring-red-500" : ""
                      }`}
                    >
                      <RichTextEditor
                        ref={editorRef}
                        onChange={handleContentChange}
                        placeholder="Start writing your inspiring content..."
                        className="w-full"
                      />
                    </div>
                    {errors.content && (
                      <div className="px-6 pb-4">
                        <p className="text-sm text-red-500 flex items-center mt-2">
                          <X className="h-4 w-4 mr-1" />
                          {errors.content.message as string}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Type className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-700">
                          Words
                        </p>
                        <p className="text-lg font-bold text-blue-900">
                          {wordCount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700">
                          Characters
                        </p>
                        <p className="text-lg font-bold text-green-900">
                          {charCount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-700">
                          Read
                        </p>
                        <p className="text-lg font-bold text-purple-900">
                          {readingTime} min
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-700">
                          Date
                        </p>
                        <p className="text-sm font-bold text-orange-900">
                          {currentDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields Column - Right Side */}
              <div className="space-y-6">
                {/* Post Information */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Post Information</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <TextInput
                      name="title"
                      label="Title"
                      placeholder="Enter an engaging post title"
                      required
                      validation={{
                        required: "Title is required",
                        minLength: {
                          value: 3,
                          message: "Title must be at least 3 characters",
                        },
                      }}
                    />

                    <TextInput
                      name="slug"
                      label="Slug"
                      placeholder="your-post-url"
                      required
                      validation={{
                        required: "Slug is required",
                        pattern: {
                          value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                          message: "Slug must be in kebab-case format",
                        },
                      }}
                    />

                    <TextInput
                      name="coverImage"
                      label="Cover Image URL"
                      placeholder="https://example.com/image.jpg"
                      required
                      type="url"
                      validation={{
                        required: "Cover image is required",
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message: "Must be a valid URL",
                        },
                      }}
                    />

                    <TextareaInput
                      name="excerpt"
                      label="Excerpt"
                      placeholder="Brief summary for preview and SEO..."
                      required
                      minRows={3}
                      maxLength={300}
                      description="Max 300 characters"
                    />
                  </div>
                </div>

                {/* Publishing Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                  <p className="text-sm text-blue-700">
                    <strong>💡 Tip:</strong> Make sure all fields are filled out
                    before saving. The slug will be auto-generated from the
                    title.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
