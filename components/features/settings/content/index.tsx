"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Card, CardBody, Divider } from "@heroui/react";
import {
  ContentSettingsValue,
  DEFAULT_CONTENT_SETTINGS,
  SETTING_KEYS,
  SETTING_CATEGORIES,
} from "../interfaces/settings";
import { SettingsService } from "@/services/settingsService";
import { SkeletonCard } from "@/components/ui/Skeletons/SkeletonCard";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { NumberInput, SwitchInput } from "@/components/ui/Inputs";

export default function ContentSettings() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const methods = useForm<ContentSettingsValue>({
    defaultValues: DEFAULT_CONTENT_SETTINGS,
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const setting = await SettingsService.getSettingByKey(
        SETTING_KEYS.CONTENT
      );
      if (setting) {
        reset(setting.value as ContentSettingsValue);
      }
    } catch (error) {
      console.error("Failed to load content settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ContentSettingsValue) => {
    setSaveStatus("saving");
    try {
      await SettingsService.upsertSetting({
        key: SETTING_KEYS.CONTENT,
        value: data as unknown as JSON,
        category: SETTING_CATEGORIES.CONTENT,
        description: "Content display configuration",
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to save content settings:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  if (loading) {
    return <SkeletonCard hasFooter={false} hasHeader={false} rows={20} />;
  }

  return (
    <FormProvider {...methods}>
      <div className="space-y-4 md:space-y-6">
        <div>
          <Heading className="text-xl md:text-2xl font-bold">
            Content Settings
          </Heading>
          <Text className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Configure how content is displayed on your blog
          </Text>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-6"
        >
          {/* Posts Per Page */}
          <Card shadow="sm" className="w-full">
            <CardBody className="p-4 md:p-6">
              <NumberInput
                name="postsPerPage"
                label="Posts Per Page"
                placeholder="10"
                description="Number of posts to display per page (1-50)"
                min={1}
                max={50}
              />
            </CardBody>
          </Card>

          <Divider className="my-2" />

          {/* Display Options Section */}
          <div>
            <Heading className="text-base md:text-lg font-semibold mb-3">
              Display Options
            </Heading>

            {/* Show Featured Image */}
            <Card shadow="sm" className="w-full mb-4">
              <CardBody className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <Heading className="text-sm md:text-base font-medium">
                      Show Featured Image
                    </Heading>
                    <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Display featured image at the top of blog posts
                    </Text>
                  </div>
                  <div className="flex justify-start sm:justify-end">
                    <SwitchInput
                      name="showFeaturedImage"
                      color="primary"
                      size="lg"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Show Author Info */}
            <Card shadow="sm" className="w-full mb-4">
              <CardBody className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <Heading className="text-sm md:text-base font-medium">
                      Show Author Information
                    </Heading>
                    <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Display author name and avatar on posts
                    </Text>
                  </div>
                  <div className="flex justify-start sm:justify-end">
                    <SwitchInput
                      name="showAuthorInfo"
                      color="primary"
                      size="lg"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Show Publish Date */}
            <Card shadow="sm" className="w-full mb-4">
              <CardBody className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <Heading className="text-sm md:text-base font-medium">
                      Show Publish Date
                    </Heading>
                    <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Display when the post was published
                    </Text>
                  </div>
                  <div className="flex justify-start sm:justify-end">
                    <SwitchInput
                      name="showPublishDate"
                      color="primary"
                      size="lg"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Show Reading Time */}
            <Card shadow="sm" className="w-full">
              <CardBody className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <Heading className="text-sm md:text-base font-medium">
                      Show Reading Time
                    </Heading>
                    <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Display estimated reading time for each post
                    </Text>
                  </div>
                  <div className="flex justify-start sm:justify-end">
                    <SwitchInput
                      name="showReadingTime"
                      color="primary"
                      size="lg"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <Divider className="my-4" />

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <Button
              type="submit"
              color="primary"
              size="lg"
              isDisabled={!isDirty || saveStatus === "saving"}
              isLoading={saveStatus === "saving"}
              className="w-full sm:w-auto"
            >
              {saveStatus === "saving" ? "Saving..." : "Save Changes"}
            </Button>

            {saveStatus === "success" && (
              <Text className="text-sm text-green-600">
                Settings saved successfully!
              </Text>
            )}
            {saveStatus === "error" && (
              <Text className="text-sm text-red-600">
                Failed to save settings
              </Text>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
