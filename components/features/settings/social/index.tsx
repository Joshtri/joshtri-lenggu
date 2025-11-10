"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Card, CardBody, Divider } from "@heroui/react";
import {
  SocialMediaSettingsValue,
  DEFAULT_SOCIAL_MEDIA_SETTINGS,
  SETTING_KEYS,
  SETTING_CATEGORIES,
} from "../interfaces/settings";
import { SettingsService } from "@/services/settingsService";
import { SkeletonCard } from "@/components/ui/Skeletons/SkeletonCard";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { TextInput, SwitchInput } from "@/components/ui/Inputs";
import { Facebook, Twitter, Instagram, Github, Linkedin } from "lucide-react";

export default function SocialMediaSettings() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const methods = useForm<SocialMediaSettingsValue>({
    defaultValues: DEFAULT_SOCIAL_MEDIA_SETTINGS,
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
        SETTING_KEYS.SOCIAL_MEDIA
      );
      if (setting) {
        reset(setting.value as SocialMediaSettingsValue);
      }
    } catch (error) {
      console.error("Failed to load social media settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SocialMediaSettingsValue) => {
    setSaveStatus("saving");
    try {
      await SettingsService.upsertSetting({
        key: SETTING_KEYS.SOCIAL_MEDIA,
        value: data as unknown as JSON,
        category: SETTING_CATEGORIES.SOCIAL,
        description: "Social media links and sharing configuration",
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to save social media settings:", error);
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
            Social Media Settings
          </Heading>
          <Text className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Configure social media links and sharing options
          </Text>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-6"
        >
          {/* Social Sharing */}
          <Card shadow="sm" className="w-full">
            <CardBody className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <Heading className="text-base md:text-lg font-semibold">
                    Enable Social Sharing
                  </Heading>
                  <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Show social media share buttons on blog posts
                  </Text>
                </div>
                <div className="flex justify-start sm:justify-end">
                  <SwitchInput name="socialSharing" color="primary" size="lg" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Divider className="my-2" />

          {/* Social Media Profiles Section */}
          <div>
            <Heading className="text-base md:text-lg font-semibold mb-2">
              Social Media Profiles
            </Heading>
            <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-4">
              Add links to your social media profiles. Leave empty to hide.
            </Text>

            <div className="space-y-4">
              {/* Facebook */}
              <Card shadow="sm" className="w-full">
                <CardBody className="p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <Heading className="text-sm md:text-base font-medium">
                      Facebook
                    </Heading>
                  </div>
                  <TextInput
                    name="facebook"
                    placeholder="https://facebook.com/yourpage"
                    type="url"
                    required={false}
                    validation={{
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: "Must be a valid URL",
                      },
                    }}
                  />
                </CardBody>
              </Card>

              {/* Twitter */}
              <Card shadow="sm" className="w-full">
                <CardBody className="p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Twitter className="w-5 h-5 text-sky-500" />
                    <Heading className="text-sm md:text-base font-medium">
                      Twitter
                    </Heading>
                  </div>
                  <TextInput
                    name="twitter"
                    placeholder="https://twitter.com/yourusername"
                    type="url"
                    required={false}
                    validation={{
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: "Must be a valid URL",
                      },
                    }}
                  />
                </CardBody>
              </Card>

              {/* Instagram */}
              <Card shadow="sm" className="w-full">
                <CardBody className="p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <Heading className="text-sm md:text-base font-medium">
                      Instagram
                    </Heading>
                  </div>
                  <TextInput
                    name="instagram"
                    placeholder="https://instagram.com/yourusername"
                    type="url"
                    required={false}
                    validation={{
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: "Must be a valid URL",
                      },
                    }}
                  />
                </CardBody>
              </Card>

              {/* GitHub */}
              <Card shadow="sm" className="w-full">
                <CardBody className="p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Github className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                    <Heading className="text-sm md:text-base font-medium">
                      GitHub
                    </Heading>
                  </div>
                  <TextInput
                    name="github"
                    placeholder="https://github.com/yourusername"
                    type="url"
                    required={false}
                    validation={{
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: "Must be a valid URL",
                      },
                    }}
                  />
                </CardBody>
              </Card>

              {/* LinkedIn */}
              <Card shadow="sm" className="w-full">
                <CardBody className="p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Linkedin className="w-5 h-5 text-blue-700" />
                    <Heading className="text-sm md:text-base font-medium">
                      LinkedIn
                    </Heading>
                  </div>
                  <TextInput
                    name="linkedin"
                    placeholder="https://linkedin.com/in/yourusername"
                    type="url"
                    required={false}
                    validation={{
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: "Must be a valid URL",
                      },
                    }}
                  />
                </CardBody>
              </Card>
            </div>
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
