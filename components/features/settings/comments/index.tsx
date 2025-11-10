"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Card, CardBody, Divider } from "@heroui/react";
import {
  CommentSettingsValue,
  DEFAULT_COMMENT_SETTINGS,
  SETTING_KEYS,
  SETTING_CATEGORIES,
} from "../interfaces/settings";
import { SettingsService } from "@/services/settingsService";
import { SkeletonCard } from "@/components/ui/Skeletons/SkeletonCard";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { NumberInput, SwitchInput } from "@/components/ui/Inputs";

export default function CommentSettings() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const methods = useForm<CommentSettingsValue>({
    defaultValues: DEFAULT_COMMENT_SETTINGS,
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = methods;

  const commentsEnabled = watch("commentsEnabled");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const setting = await SettingsService.getSettingByKey(
        SETTING_KEYS.COMMENTS
      );
      if (setting) {
        reset(setting.value as CommentSettingsValue);
      }
    } catch (error) {
      console.error("Failed to load comment settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CommentSettingsValue) => {
    setSaveStatus("saving");
    try {
      await SettingsService.upsertSetting({
        key: SETTING_KEYS.COMMENTS,
        value: data as unknown as JSON,
        category: SETTING_CATEGORIES.FEATURES,
        description: "Comment system configuration",
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to save comment settings:", error);
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
            Comment Settings
          </Heading>
          <Text className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Configure comment system behavior and moderation
          </Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          {/* Enable Comments */}
          <Card shadow="sm" className="w-full">
            <CardBody className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Heading className="text-base md:text-lg font-semibold">
                    Enable Comments
                  </Heading>
                  <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Allow users to post comments on your blog posts
                  </Text>
                </div>
                <div className="flex justify-start sm:justify-end">
                  <SwitchInput
                    name="commentsEnabled"
                    color="primary"
                    size="lg"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Allow Guest Comments */}
          <Card shadow="sm" className="w-full">
            <CardBody className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Heading className="text-base md:text-lg font-semibold">
                    Allow Guest Comments
                  </Heading>
                  <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Allow users to comment without creating an account
                  </Text>
                </div>
                <div className="flex justify-start sm:justify-end">
                  <SwitchInput
                    name="allowGuestComments"
                    color="primary"
                    size="lg"
                    disabled={!commentsEnabled}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Require Email Verification */}
          <Card shadow="sm" className="w-full">
            <CardBody className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Heading className="text-base md:text-lg font-semibold">
                    Require Email Verification
                  </Heading>
                  <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Users must verify their email before commenting
                  </Text>
                </div>
                <div className="flex justify-start sm:justify-end">
                  <SwitchInput
                    name="requireEmailVerification"
                    color="primary"
                    size="lg"
                    disabled={!commentsEnabled}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Spam Protection */}
          <Card shadow="sm" className="w-full">
            <CardBody className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Heading className="text-base md:text-lg font-semibold">
                    Spam Protection
                  </Heading>
                  <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Enable automatic spam detection and filtering
                  </Text>
                </div>
                <div className="flex justify-start sm:justify-end">
                  <SwitchInput
                    name="spamProtection"
                    color="primary"
                    size="lg"
                    disabled={!commentsEnabled}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Max Comment Length */}
          <Card shadow="sm" className="w-full">
            <CardBody className="p-4 md:p-6">
              <NumberInput
                name="maxCommentLength"
                label="Maximum Comment Length (characters)"
                placeholder="2000"
                disabled={!commentsEnabled}
                description="Recommended: 500-2000 characters"
                min={100}
                max={10000}
              />
            </CardBody>
          </Card>

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
