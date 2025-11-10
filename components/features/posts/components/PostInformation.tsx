import { SelectInput, TextareaInput, TextInput } from "@/components/ui/Inputs";
import { ImageUploadInput } from "@/components/ui/Inputs/ImageUploadInput";
// import { ImageUpload } from "@/components/ui/Inputs/ImageUpload";
import React from "react";
import { Label } from "../../labels/interfaces/labels";
import { Type } from "../../types/interfaces";
import { Heading } from "@/components/ui/Heading";

interface PostInformationProps {
  labelsOptions: Array<Label>;
  typesOptions: Array<Type>;
}

const PostInformation = ({
  labelsOptions,
  typesOptions,
}: PostInformationProps) => {
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4 bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-700">
          <Heading level={2} className="text-lg font-semibold text-gray-900 dark:text-white">Post Information</Heading>
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

          <ImageUploadInput
            name="coverImage"
            label="Cover Image"
            required
            helperText="Upload an image (max 5MB)"
          />

          <SelectInput
            name="labelId"
            label="Label"
            placeholder="Select a label"
            options={labelsOptions.map((label) => ({
              label: label.name,
              value: label.id.toString(),
            }))}
            required
          />

          <SelectInput
            name="typeId"
            label="Type"
            placeholder="Select a type"
            options={typesOptions.map((type) => ({
              label: type.name,
              value: type.id.toString(),
            }))}
            required={true}
            errorMessage="Type is required"
            isInvalid={!typesOptions.length}
          />

          <TextareaInput
            name="excerpt"
            label="Excerpt"
            placeholder="Brief summary for preview and SEO..."
            required
            minRows={3}
            maxLength={300}
            description="Max 300 characters"
            errorMessage="Excerpt is required"
          />
        </div>
      </div>
    </>
  );
};

export default PostInformation;
