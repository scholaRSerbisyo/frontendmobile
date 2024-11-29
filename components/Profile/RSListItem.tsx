import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '~/components/ui/text'

interface RSListItemProps {
  title: string
  status: 'Complete' | 'Incomplete'
  hours: string
}

export function RSListItem({ title, status, hours }: RSListItemProps) {
  return (
    <View style={styles.container}>
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
    backgroundColor: '#F5F5F5',
    padding: 16,
    marginBottom: 1,
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

