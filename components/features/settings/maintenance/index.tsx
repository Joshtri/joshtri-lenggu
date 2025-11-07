'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  MaintenanceSettingsValue,
  DEFAULT_MAINTENANCE_SETTINGS,
  SETTING_KEYS,
  SETTING_CATEGORIES
} from '../interfaces/settings';
import { SettingsService } from '@/services/settingsService';

export default function MaintenanceSettings() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<MaintenanceSettingsValue>({
    defaultValues: DEFAULT_MAINTENANCE_SETTINGS,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'allowedIPs',
  });

  const maintenanceMode = watch('maintenanceMode');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const setting = await SettingsService.getSettingByKey(SETTING_KEYS.MAINTENANCE);
      if (setting) {
        reset(setting.value as MaintenanceSettingsValue);
      }
    } catch (error) {
      console.error('Failed to load maintenance settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: MaintenanceSettingsValue) => {
    setSaveStatus('saving');
    try {
      await SettingsService.upsertSetting({
        key: SETTING_KEYS.MAINTENANCE,
        value: data,
        category: SETTING_CATEGORIES.SYSTEM,
        description: 'Maintenance mode configuration',
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save maintenance settings:', error);
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
        <h2 className="text-2xl font-bold">Maintenance Mode</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Control site availability and maintenance messaging
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Maintenance Mode Toggle */}
        <div className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Enable Maintenance Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                When enabled, only allowed IPs can access the site
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('maintenanceMode')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Maintenance Message */}
        <div>
          <label className="block text-sm font-medium mb-2">Maintenance Message</label>
          <textarea
            {...register('maintenanceMessage', {
              required: 'Maintenance message is required'
            })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            placeholder="We're upgrading our systems. Please check back soon!"
            disabled={!maintenanceMode}
          />
          {errors.maintenanceMessage && (
            <p className="mt-1 text-sm text-red-600">{errors.maintenanceMessage.message}</p>
          )}
        </div>

        {/* Allowed IPs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Allowed IP Addresses</label>
            <button
              type="button"
              onClick={() => append('')}
              disabled={!maintenanceMode}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              + Add IP
            </button>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            IP addresses that can access the site during maintenance
          </p>

          <div className="space-y-2">
            {fields.length === 0 && (
              <p className="text-sm text-gray-500 italic">No allowed IPs configured</p>
            )}
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  type="text"
                  {...register(`allowedIPs.${index}` as const, {
                    pattern: {
                      value: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
                      message: 'Invalid IP address format'
                    }
                  })}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                  placeholder="192.168.1.1"
                  disabled={!maintenanceMode}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={!maintenanceMode}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Box */}
        {maintenanceMode && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Warning: Maintenance Mode is Active
                </h3>
                <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                  Only allowed IP addresses will be able to access the site.
                </p>
              </div>
            </div>
          </div>
        )}

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
