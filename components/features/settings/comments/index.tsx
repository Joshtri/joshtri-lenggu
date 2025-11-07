'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  CommentSettingsValue,
  DEFAULT_COMMENT_SETTINGS,
  SETTING_KEYS,
  SETTING_CATEGORIES
} from '../interfaces/settings';
import { SettingsService } from '@/services/settingsService';

export default function CommentSettings() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<CommentSettingsValue>({
    defaultValues: DEFAULT_COMMENT_SETTINGS,
  });

  const commentsEnabled = watch('commentsEnabled');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const setting = await SettingsService.getSettingByKey(SETTING_KEYS.COMMENTS);
      if (setting) {
        reset(setting.value as CommentSettingsValue);
      }
    } catch (error) {
      console.error('Failed to load comment settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CommentSettingsValue) => {
    setSaveStatus('saving');
    try {
      await SettingsService.upsertSetting({
        key: SETTING_KEYS.COMMENTS,
        value: data,
        category: SETTING_CATEGORIES.FEATURES,
        description: 'Comment system configuration',
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save comment settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  if (loading) {
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Comment Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure comment system behavior and moderation
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Enable Comments */}
        <div className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Enable Comments</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Allow users to post comments on your blog posts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('commentsEnabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Allow Guest Comments */}
        <div className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Allow Guest Comments</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Allow users to comment without creating an account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('allowGuestComments')}
                disabled={!commentsEnabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>

        {/* Require Email Verification */}
        <div className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Require Email Verification</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Users must verify their email before commenting
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('requireEmailVerification')}
                disabled={!commentsEnabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>

        {/* Spam Protection */}
        <div className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Spam Protection</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Enable automatic spam detection and filtering
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('spamProtection')}
                disabled={!commentsEnabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>

        {/* Max Comment Length */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Maximum Comment Length (characters)
          </label>
          <input
            type="number"
            {...register('maxCommentLength', {
              required: 'Max length is required',
              min: { value: 100, message: 'Minimum 100 characters' },
              max: { value: 10000, message: 'Maximum 10000 characters' }
            })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            disabled={!commentsEnabled}
            min={100}
            max={10000}
          />
          {errors.maxCommentLength && (
            <p className="mt-1 text-sm text-red-600">{errors.maxCommentLength.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Recommended: 500-2000 characters
          </p>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={!isDirty || saveStatus === 'saving'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
          </button>

          {saveStatus === 'success' && (
            <span className="text-green-600">Settings saved successfully!</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-600">Failed to save settings</span>
          )}
        </div>
      </form>
    </div>
  );
}
