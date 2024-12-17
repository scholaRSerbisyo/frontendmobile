import React from 'react'
import { View, StyleSheet } from 'react-native'
import { NotificationItem } from './NotificationItem'
import { Notification } from '../types'

interface NotificationSectionProps {
  section: { title: string; data: Notification[] }
}

export function NotificationSection({ section }: NotificationSectionProps) {
  return (
    <View style={styles.section}>
      {section.data.map((notification) => (
        <NotificationItem 
          key={notification.notification_id} 
          notification={notification}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    borderColor: 'black',
    borderWidth: 1
  },
})

