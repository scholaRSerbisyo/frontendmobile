import { Notification } from './types'
import API_URL from '~/constants/constants'
import * as SecureStore from 'expo-secure-store'

export async function fetchNotifications(): Promise<Notification[]> {
    const token = await SecureStore.getItemAsync('authToken');
  try {
    const response = await fetch(`${API_URL}/api/notifications`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Add any authentication headers if required
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch notifications')
    }

    const data = await response.json()
    return data.notifications
  } catch (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
    const token = await SecureStore.getItemAsync('authToken');
  try {
    const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Add any authentication headers if required
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to mark notification as read')
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

