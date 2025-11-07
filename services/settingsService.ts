import { BaseSetting } from '@/components/features/settings/interfaces/settings';

const API_BASE_URL = process.env.NEXT_PUBLIC_SETTINGS_API_URL || 'http://localhost:5000/api';

export class SettingsService {
  /**
   * Get all settings
   */
  static async getAllSettings(): Promise<BaseSetting[]> {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }

    const result = await response.json();
    return result.data || [];
  }

  /**
   * Get setting by key
   */
  static async getSettingByKey(key: string): Promise<BaseSetting | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch setting');
      }

      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error fetching setting:', error);
      return null;
    }
  }

  /**
   * Get settings by category
   */
  static async getSettingsByCategory(category: string): Promise<BaseSetting[]> {
    const response = await fetch(`${API_BASE_URL}/settings?category=${category}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch settings by category');
    }

    const result = await response.json();
    return result.data || [];
  }

  /**
   * Create or update a setting
   */
  static async upsertSetting(data: {
    key: string;
    value: JSON;
    description?: string;
    category: string;
    isActive?: boolean;
  }): Promise<BaseSetting> {

    try {

      const existingSetting = await this.getSettingByKey(data.key);

      if (existingSetting) {

        const response = await fetch(`${API_BASE_URL}/settings/${data.key}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            value: data.value,
            description: data.description ?? existingSetting.description,
            isActive: data.isActive ?? existingSetting.isActive,
          }),
        });

        if (!response.ok) throw new Error('Failed to update existing setting');
        const result = await response.json();
        return result.data;
      }

      else {

        const response = await fetch(`${API_BASE_URL}/settings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            isActive: data.isActive ?? true,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save setting');
        }
        const result = await response.json();
        return result.data;
      }
    } catch (error) {
      console.error('Error in upsertSetting:', error);
      throw error;
    }
  }

  /**
   * Update a setting by key
   */
  static async updateSetting(
    key: string,
    data: {
      value?: JSON;
      description?: string;
      isActive?: boolean;
    }
  ): Promise<BaseSetting> {
    const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update setting');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Delete a setting
   */
  static async deleteSetting(key: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete setting');
    }
  }

  /**
   * Toggle setting active status
   */
  static async toggleActive(key: string): Promise<BaseSetting> {
    const setting = await this.getSettingByKey(key);
    if (!setting) {
      throw new Error('Setting not found');
    }

    return this.updateSetting(key, {
      isActive: !setting.isActive,
    });
  }
}
