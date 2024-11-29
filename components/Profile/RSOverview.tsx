import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text } from '../ui/text'

interface RSEntry {
  date: string
  time: string
  type: string
  status: string
}

const entries: RSEntry[] = [
  {
    date: 'January 15, 2024',
    time: '9:00 AM',
    type: 'Community Service',
    status: 'Completed'
  },
  {
    date: 'January 10, 2024',
    time: '2:00 PM',
    type: 'Library Assistance',
    status: 'Pending'
  },
  {
    date: 'January 5, 2024',
    time: '10:00 AM',
    type: 'Office Work',
    status: 'Completed'
  },
  {
    date: 'December 28, 2023',
    time: '1:00 PM',
    type: 'Community Service',
    status: 'Completed'
  },
  {
    date: 'December 20, 2023',
    time: '3:00 PM',
    type: 'Library Assistance',
    status: 'Completed'
  }
]

export function RSOverview() {
  return (
    <ScrollView style={styles.container}>
      {entries.map((entry, index) => (
        <View key={index} style={styles.entry}>
          <View style={styles.field}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{entry.date}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Time:</Text>
            <Text style={styles.value}>{entry.time}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Type of RS:</Text>
            <Text style={styles.value}>{entry.type}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{entry.status}</Text>
          </View>
          {index !== entries.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  entry: {
    padding: 16,
  },
  field: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#191851',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 16,
  },
})

