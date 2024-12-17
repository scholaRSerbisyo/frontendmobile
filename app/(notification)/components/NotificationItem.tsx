import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { getImageUrl } from '~/components/services/imageService';
import { Notification } from '../types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';

interface NotificationItemProps {
  notification: Notification;
}

const getIconBackgroundColor = (eventTypeName: string) => {
  switch (eventTypeName) {
    case 'Meeting':
      return 'blue';
    case 'Reminder':
      return 'green';
    default:
      return 'gray';
  }
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchImage = async () => {
      if (notification.event_image_uuid) {
        const url = await getImageUrl(notification.event_image_uuid);
        setImageUrl(url);
      }
      setIsLoading(false);
    };

    fetchImage();
  }, [notification.event_image_uuid]);

  const relativeTime = formatDistanceToNow(parseISO(notification.created_at), { addSuffix: true });

  const handlePress = () => {
    router.push(`/(newsfeed)/${notification.event_id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: getIconBackgroundColor(notification.event_type_name) }]}>
        {isLoading ? (
          <Text style={styles.avatarText}>...</Text>
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>{notification.event_type_name.substring(0, 2)}</Text>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{notification.event_name}</Text>
        <Text style={styles.description} numberOfLines={2}>{notification.description}</Text>
        <Text style={styles.relativeTime}>{relativeTime}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  relativeTime: {
    fontSize: 12,
    color: '#888888',
    fontStyle: 'italic',
  },
});

