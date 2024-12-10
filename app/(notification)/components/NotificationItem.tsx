import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '~/components/ui/text'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Notification } from '../types'

interface NotificationItemProps {
  notification: Notification
  onPress?: () => void
}

const getIconBackgroundColor = (type: string) => {
  switch (type) {
    case 'CSO':
      return '#007AFF'
    case 'CB':
      return '#FF3B30'
    case 'SB':
      return '#FFD700'
    default:
      return '#007AFF'
  }
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Avatar style={[styles.avatar, { backgroundColor: getIconBackgroundColor(notification.type) }]}>
        <AvatarFallback>
          <Text style={styles.avatarText}>{notification.type}</Text>
        </AvatarFallback>
      </Avatar>
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.subtitle}>{notification.subtitle}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#E5E5E5',
    marginBottom: 12,
    marginTop: 4,
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
    color: '#666666',
    marginTop: 2,
  },
})

