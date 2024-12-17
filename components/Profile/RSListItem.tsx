import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '../ui/text'

interface RSListItemProps {
  title: string
  status: 'Complete' | 'Incomplete'
  hours: string
}

export function RSListItem({ title, status, hours }: RSListItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[
        styles.status,
        status === 'Complete' ? styles.complete : styles.incomplete
      ]}>
        {status}
      </Text>
      <Text style={styles.hours}>{hours}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  complete: {
    color: '#34C759',
  },
  incomplete: {
    color: '#FF3B30',
  },
  hours: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
    textAlign: 'right',
  },
})

