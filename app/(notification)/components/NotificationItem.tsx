import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '~/components/ui/text'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Notification } from '../types'

interface NotificationItemProps {
  notification: Notification
  onPress: () => void
}

const getIconBackgroundColor = (type: string) => {
  switch (type) {
    case 'CSO':
      return '#007AFF'
    case 'School':
      return '#FFD700'
    case 'Community':
      return '#FF3B30'
    default:
      return '#007AFF'
  }
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Avatar alt='' style={[styles.avatar, { backgroundColor: getIconBackgroundColor(notification.data.eventType) }]}>
        <AvatarFallback>
          <Text style={styles.avatarText}>{notification.data.eventType.substring(0, 2)}</Text>
        </AvatarFallback>
      </Avatar>
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.subtitle}>{notification.data.eventName}</Text>
        <Text style={styles.details}>{notification.data.date} | {notification.data.timeFrom} - {notification.data.timeTo}</Text>
        <Text style={styles.description} numberOfLines={2}>{notification.data.description}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#E5E5E5',
    marginBottom: 12,
    marginTop: 4,
    borderRadius: 8,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  details: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: '#666666',
  },
})

