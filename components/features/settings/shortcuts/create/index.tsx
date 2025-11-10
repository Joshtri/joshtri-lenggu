"use client";

import { PageHeader } from "@/components/ui/Common/PageHeader";
import { Heading } from "@/components/ui/Heading";
import { SwitchInput, TextInput } from "@/components/ui/Inputs";
import { Text } from "@/components/ui/Text";
import { ShortcutService } from "@/services/shortcutService";
import { Button, Card, CardBody } from "@heroui/react";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface ShortcutFormData {
  name: string;
  url: string;
  description?: string;
  icon: string;
  isActive: boolean;
}

export default function ShortcutCreate() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<ShortcutFormData>({
    defaultValues: {
      name: "",
      url: "",
      description: "",
      // icon: "",
      isActive: true,
    },
  });

  const {
    handleSubmit,
    formState: { errors, isDirty },
  } = methods;

  const onSubmit = async (data: ShortcutFormData) => {
    setIsSubmitting(true);
    try {
      await ShortcutService.createShortcut(data);
      console.log("✅ Shortcut created successfully!");
      router.push("/settings?tab=shortcuts");
    } catch (error) {
      console.error("Error creating shortcut:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create shortcut. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Create New Shortcut"
        description="Add a new quick access shortcut to your dashboard."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Shortcuts", href: "/settings/shortcuts" },
          { label: "Create" },
        ]}
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
              onPress={() => router.push("/settings?tab=shortcuts")}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              size="sm"
              isLoading={isSubmitting}
              onPress={() => handleSubmit(onSubmit)()}
              startContent={!isSubmitting && <Save className="h-4 w-4" />}
            >
              {isSubmitting ? "Saving..." : "Save Shortcut"}
            </Button>
          </>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardBody className="p-6 space-y-4">
                <div>
                  <Heading className="text-lg font-semibold mb-1">
                    Basic Information
                  </Heading>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Enter the shortcut details
                  </Text>
                </div>

                <TextInput
                  name="name"
                  label="Name"
                  placeholder="Enter shortcut name"
                  required
                  errorMessage={errors.name?.message}
                />

                <TextInput
                  name="url"
                  label="URL"
                  placeholder="https://example.com"
                  required
                  errorMessage={errors.url?.message}
                />

                <TextInput
                  name="description"
                  label="Description"
                  placeholder="Enter description (optional)"
                  errorMessage={errors.description?.message}
                />

                {/* <IconSelector
                  name="icon"
                  label="Icon"
                  required
                  errorMessage={errors.icon?.message}
                /> */}
              </CardBody>
            </Card>

            {/* Status */}
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Heading className="text-base font-semibold">
                      Active Status
                    </Heading>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Enable this shortcut to make it visible
                    </Text>
                  </div>
                  <SwitchInput name="isActive" color="primary" size="lg" />
                </div>
              </CardBody>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardBody className="p-6 bg-blue-50 dark:bg-blue-950">
                <div className="space-y-2">
                  <Heading className="text-base font-semibold text-blue-900 dark:text-blue-100">
                    💡 Tips for Creating Shortcuts
                  </Heading>
                  <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1 list-disc list-inside">
                    <li>Use a clear and descriptive name</li>
                    <li>Make sure the URL is valid and accessible</li>
                    <li>Add an emoji icon for better visual identification</li>
                    <li>Use descriptions to provide context for each shortcut</li>
                  </ul>
                </div>
              </CardBody>
            </Card>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
