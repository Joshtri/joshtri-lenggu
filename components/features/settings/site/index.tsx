"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Card, CardBody, Divider } from "@heroui/react";
import {
  SiteSettingsValue,
  DEFAULT_SITE_SETTINGS,
  SETTING_KEYS,
  SETTING_CATEGORIES,
} from "../interfaces/settings";
import { SettingsService } from "@/services/settingsService";
import { TextInput, TextareaInput, SelectInput } from "@/components/ui/Inputs";
import { ImageUploadInput } from "@/components/ui/Inputs/ImageUploadInput";
import { SkeletonCard } from "@/components/ui/Skeletons/SkeletonCard";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export default function SiteSettings() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const methods = useForm<SiteSettingsValue>({
    defaultValues: DEFAULT_SITE_SETTINGS,
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
      const setting = await SettingsService.getSettingByKey(SETTING_KEYS.SITE);
      if (setting) {
        reset(setting.value as SiteSettingsValue);
      }
    } catch (error) {
      console.error("Failed to load site settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SiteSettingsValue) => {
    setSaveStatus("saving");
    try {
      await SettingsService.upsertSetting({
        key: SETTING_KEYS.SITE,
        value: data as unknown as JSON,
        category: SETTING_CATEGORIES.GENERAL,
        description: "General site configuration",
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to save site settings:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  if (loading) {
    return <SkeletonCard hasFooter={false} hasHeader={false} rows={20} />;
  }

  return (
    <FormProvider {...methods} >
      <div className="space-y-4 md:space-y-6">
        <div>
          <Heading className="text-xl md:text-2xl font-bold">
            Site Settings
          </Heading>
          <Text className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Configure general site information and preferences
          </Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          {/* Basic Information Section */}
          <div>
            <Heading className="text-base md:text-lg font-semibold mb-3">
              Basic Information
            </Heading>

            <div className="space-y-4">
              {/* Site Name */}
              <Card shadow="sm" className="w-full">
                <CardBody className="p-4 md:p-6">
                  <TextInput
                    name="siteName"
                    label="Site Name"
                    placeholder="My Blog"
                    required={true}
                    validation={{ required: "Site name is required" }}
                  />
                </CardBody>
              </Card>

              {/* Site Description */}
              <Card shadow="sm" className="w-full">
                <CardBody className="p-4 md:p-6">
                  <TextareaInput
                    name="siteDescription"
                    label="Site Description"
                    placeholder="A blog about technology and life"
                    rows={3}
                    required={true}
                  />
                </CardBody>
              </Card>

              {/* Site URL */}
              <Card shadow="sm" className="w-full">
                <CardBody className="p-4 md:p-6">
                  <TextInput
                    name="siteUrl"
                    label="Site URL"
                    type="url"
                    placeholder="https://myblog.com"
                    required={true}
                    validation={{ required: "Site URL is required" }}
                  />
                </CardBody>
              </Card>
            </div>
          </div>

          <Divider className="my-2" />

          {/* Branding Section */}
          <div>
            <Heading className="text-base md:text-lg font-semibold mb-3">
              Branding
            </Heading>

            <Card shadow="sm" className="w-full">
              <CardBody className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <ImageUploadInput
                    name="logo"
                    label="Logo"
                    required={false}
                    helperText="Upload your site logo (will upload on save)"
                  />
                  <ImageUploadInput
                    name="favicon"
                    label="Favicon"
                    required={false}
                    helperText="Upload your site favicon (will upload on save)"
                  />
                </div>
              </CardBody>
            </Card>
          </div>

          <Divider className="my-2" />

          {/* Localization Section */}
          <div>
            <Heading className="text-base md:text-lg font-semibold mb-3">
              Localization
            </Heading>

            <Card shadow="sm" className="w-full">
              <CardBody className="p-4 md:p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectInput
                      name="timezone"
                      label="Timezone"
                      placeholder="Select timezone"
                      required={true}
                      options={[
                        { label: "Asia/Jakarta (WIB)", value: "Asia/Jakarta" },
                        { label: "Asia/Makassar (WITA)", value: "Asia/Makassar" },
                        { label: "Asia/Jayapura (WIT)", value: "Asia/Jayapura" },
                        { label: "UTC", value: "UTC" },
                      ]}
                    />
                    <SelectInput
                      name="language"
                      label="Language"
                      placeholder="Select language"
                      required={true}
                      options={[
                        { label: "Bahasa Indonesia", value: "id" },
                        { label: "English", value: "en" },
                      ]}
                    />
                  </div>

                  <SelectInput
                    name="dateFormat"
                    label="Date Format"
                    placeholder="Select date format"
                    required={true}
                    options={[
                      { label: "DD/MM/YYYY (31/12/2024)", value: "DD/MM/YYYY" },
                      { label: "MM/DD/YYYY (12/31/2024)", value: "MM/DD/YYYY" },
                    ]}
                  />
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
