import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '../ui/text'

interface RSListItemProps {
  title: string
  status: 'Complete' | 'Incomplete'
  hours: string
  isYear?: boolean
}

export function RSListItem({ title, status, hours, isYear = false }: RSListItemProps) {
  return (
    <View style={[styles.container, isYear && styles.yearContainer]}>
      <View style={styles.leftContent}>
        <Text style={styles.title}>{title}</Text>
        <Text 
          style={[
            styles.status,
            status === 'Complete' ? styles.complete : styles.incomplete
          ]}
        >
          {status}
        </Text>
      </View>
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
    marginBottom: 1,
  },
  yearContainer: {
    backgroundColor: '#E8E8E8',
  },
  leftContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#191851',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
  },
  complete: {
    color: '#34C759',
  },
  incomplete: {
    color: '#FF3B30',
  },
  hours: {
    fontSize: 16,
    color: '#191851',
    fontWeight: '500',
  },
})

