export interface Shortcut {
  id: string;
  name: string;
  url: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_SETTINGS_API_URL || 'http://localhost:5000/api';

export class ShortcutService {
  /**
   * Get all shortcuts with optional filtering
   */
  static async getAllShortcuts(params?: {
    search?: string;
    isActive?: boolean;
  }): Promise<Shortcut[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));

    const response = await fetch(`${API_BASE_URL}/shortcuts?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch shortcuts');
    }

    const result = await response.json();
    return result.data || [];
  }

  /**
   * Get shortcut by ID
   */
  static async getShortcutById(id: string): Promise<Shortcut | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/shortcuts/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch shortcut');
      }

      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error fetching shortcut:', error);
      return null;
    }
  }

  /**
   * Create a new shortcut
   */
  static async createShortcut(data: {
    name: string;
    url: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
  }): Promise<Shortcut> {
    const response = await fetch(`${API_BASE_URL}/shortcuts`, {
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
      throw new Error('Failed to create shortcut');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Update a shortcut by ID
   */
  static async updateShortcut(
    id: string,
    data: {
      name?: string;
      url?: string;
      description?: string;
      icon?: string;
      isActive?: boolean;
    }
  ): Promise<Shortcut> {
    const response = await fetch(`${API_BASE_URL}/shortcuts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update shortcut');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Delete a shortcut
   */
  static async deleteShortcut(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/shortcuts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete shortcut');
    }
  }

  /**
   * Toggle shortcut active status
   */
  static async toggleActive(id: string): Promise<Shortcut> {
    const shortcut = await this.getShortcutById(id);
    if (!shortcut) {
      throw new Error('Shortcut not found');
    }

    return this.updateShortcut(id, {
      isActive: !shortcut.isActive,
    });
  }
}
