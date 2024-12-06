import axios from 'axios';
import API_URL from '~/constants/constants';
import * as SecureStore from 'expo-secure-store';

export async function getImageUrl(imageUuid: string): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${API_URL}/events/getimage`,
      { image_uuid: imageUuid },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.url) {
      return response.data.url;
    } else {
      console.error('Invalid response format:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching image URL:', error);
    return null;
  }
}

