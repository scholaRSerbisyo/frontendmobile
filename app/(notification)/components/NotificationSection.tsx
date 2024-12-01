import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '~/components/ui/text'
import { NotificationItem } from './NotificationItem'
import { NotificationSection as NotificationSectionType } from '../types'

interface NotificationSectionProps {
  section: NotificationSectionType
}

export function NotificationSection({ section }: NotificationSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{section.title}</Text>
      {section.data.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
})

