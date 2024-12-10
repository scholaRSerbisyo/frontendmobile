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
    marginTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    marginLeft: 4,
  },
})

