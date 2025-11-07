"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@heroui/react";
import {
  SiteSettingsValue,
  DEFAULT_SITE_SETTINGS,
  SETTING_KEYS,
  SETTING_CATEGORIES,
} from "../interfaces/settings";
import { SettingsService } from "@/services/settingsService";
import { TextInput, TextareaInput, SelectInput } from "@/components/ui/Inputs";
import { ImageUpload } from "@/components/ui/Inputs/ImageUpload";

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

  // Load settings on mount
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
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <FormProvider {...methods}>
      <div className="space-y-6 ">
        <div>
          <h2 className="text-2xl font-bold">Site Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure general site information and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Site Name */}
          <TextInput
            name="siteName"
            label="Site Name"
            placeholder="My Blog"
            required={true}
            validation={{ required: "Site name is required" }}
          />

          {/* Site Description */}
          <TextareaInput
            name="siteDescription"
            label="Site Description"
            placeholder="A blog about technology and life"
            rows={3}
            required={true}
          />

          {/* Site URL */}
          <TextInput
            name="siteUrl"
            label="Site URL"
            type="url"
            placeholder="https://myblog.com"
            required={true}
            validation={{ required: "Site URL is required" }}
          />

          {/* Logo & Favicon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUpload
              name="logo"
              label="Logo"
              required={false}
              helperText="Upload your site logo (will upload on save)"
            />
            <ImageUpload
              name="favicon"
              label="Favicon"
              required={false}
              helperText="Upload your site favicon (will upload on save)"
            />
          </div>

          {/* Timezone & Language */}
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

          {/* Date Format */}
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

          {/* Save Button */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button
              type="submit"
              color="primary"
              isDisabled={!isDirty || saveStatus === "saving"}
              isLoading={saveStatus === "saving"}
            >
              {saveStatus === "saving" ? "Saving..." : "Save Changes"}
            </Button>

            {saveStatus === "success" && (
              <span className="text-green-600">
                Settings saved successfully!
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-red-600">Failed to save settings</span>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
