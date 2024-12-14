import { Comment, Reply } from './types'
import API_URL from '~/constants/constants'
import * as SecureStore from 'expo-secure-store'

export async function fetchComments(eventId: number, page: number = 1, perPage: number = 20): Promise<{ comments: Comment[], currentPage: number, perPage: number, total: number, lastPage: number }> {
    const token = await SecureStore.getItemAsync('authToken');
    const scholarId = await SecureStore.getItemAsync('scholarId');
  
    if (!token || !scholarId) {
      throw new Error('Authentication token or Scholar ID not found');
    }
  
    try {
      const response = await fetch(`${API_URL}/events/${eventId}/comments?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
  
      const data = await response.json();
      return {
        comments: data.comments,
        currentPage: data.current_page,
        perPage: data.per_page,
        total: data.total,
        lastPage: data.last_page
      };
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

export async function postComment(eventId: number, commentText: string): Promise<Comment> {
  const token = await SecureStore.getItemAsync('authToken');
  const scholarId = await SecureStore.getItemAsync('scholarId');

  if (!token || !scholarId) {
    throw new Error('Authentication token or Scholar ID not found');
  }

  try {
    const response = await fetch(`${API_URL}/events/comments`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        comment_text: commentText,
        event_id: eventId,
        scholar_id: parseInt(scholarId, 10)
      }),
    })

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to post comment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
}

export async function postReply(commentId: number, replyText: string): Promise<Reply> {
  const token = await SecureStore.getItemAsync('authToken');
  const scholarId = await SecureStore.getItemAsync('scholarId');

  if (!token || !scholarId) {
    throw new Error('Authentication token or Scholar ID not found');
  }

  try {
    const response = await fetch(`${API_URL}/events/replies`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        reply_text: replyText,
        comment_id: commentId,
        scholar_id: parseInt(scholarId, 10)
      }),
    })

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to post reply');
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting reply:', error);
    throw error;
  }
}

export async function fetchReplies(commentId: number, page: number = 1, perPage: number = 20): Promise<Reply[]> {
    const token = await SecureStore.getItemAsync('authToken');
    const scholarId = await SecureStore.getItemAsync('scholarId');
  
    if (!token || !scholarId) {
      throw new Error('Authentication token or Scholar ID not found');
    }
  
    try {
      const response = await fetch(`${API_URL}/events/comments/${commentId}/replies?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch replies');
      }
  
      const data = await response.json();
      return data.replies;
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }
  }
  

export async function deleteComment(commentId: number): Promise<void> {
  const token = await SecureStore.getItemAsync('authToken');

  if (!token) {
    throw new Error('Authentication token not found');
  }

  try {
    const response = await fetch(`${API_URL}/events/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete comment');
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

export async function deleteReply(replyId: number): Promise<void> {
  const token = await SecureStore.getItemAsync('authToken');

  if (!token) {
    throw new Error('Authentication token not found');
  }

  try {
    const response = await fetch(`${API_URL}/events/replies/${replyId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete reply');
    }
  } catch (error) {
    console.error('Error deleting reply:', error);
    throw error;
  }
}

