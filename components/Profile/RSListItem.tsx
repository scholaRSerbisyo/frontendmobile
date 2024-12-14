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
      <Text style={styles.year}>{title}</Text>
      <Text 
        style={[
          styles.status,
          status === 'Complete' ? styles.complete : styles.incomplete
        ]}
      >
        {status}
      </Text>
      <Text style={styles.hours}>{hours}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  year: {
    fontSize: 16,
    color: '#343474',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
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
    color: '#343474',
    fontWeight: '500',
  },
})

