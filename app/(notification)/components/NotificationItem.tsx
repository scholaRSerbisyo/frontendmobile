import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '~/components/ui/text'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Notification } from '../types'

interface NotificationItemProps {
  notification: Notification
  onPress?: () => void
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* <Avatar className="h-10 w-10">
        <AvatarImage src={notification.avatar} />
        <AvatarFallback>{notification.title[0]}</AvatarFallback>
      </Avatar> */}
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
    padding: 12,
    backgroundColor: '#F0F0F0',
    marginBottom: 1,
  },
  content: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
})

