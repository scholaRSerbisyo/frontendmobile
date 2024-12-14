import { Notification } from './types'
import API_URL from '~/constants/constants'
import * as SecureStore from 'expo-secure-store'

export async function fetchNotifications(page: number = 1, perPage: number = 40): Promise<{ notifications: Notification[], hasMore: boolean }> {
    const token = await SecureStore.getItemAsync('authToken');
  
    try {
      const response = await fetch(`${API_URL}/events/notifications??page=${page}&per_page=${perPage}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch notifications');
      }
      const data = await response.json();
      return {
        notifications: data.notifications,
        hasMore: data.hasMore
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }
  
  export async function markNotificationAsRead(notificationId: number): Promise<void> {
    const token = await SecureStore.getItemAsync('authToken');
  
    try {
      const response = await fetch(`${API_URL}/events/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
