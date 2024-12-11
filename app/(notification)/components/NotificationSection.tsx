import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '~/components/ui/text'
import { NotificationItem } from './NotificationItem'
import { Notification } from '../types'

interface NotificationSectionProps {
  section: { title: string; data: Notification[] }
  onNotificationPress: (notification: Notification) => Promise<void>
}

export function NotificationSection({ section, onNotificationPress }: NotificationSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.data.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onPress={() => onNotificationPress(notification)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#191851',
  },
})

