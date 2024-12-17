import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text } from '../ui/text'
import { Submission } from '~/app/(profile)/total-rs'

interface RSOverviewProps {
  submissions: Submission[];
}

export function RSOverview({ submissions }: RSOverviewProps) {
  if (submissions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No Activities Found</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {submissions.map((submission) => (
        <View key={submission.submission_id} style={styles.entry}>
          <View style={styles.field}>
            <Text style={styles.label}>Event Name:</Text>
            <Text style={styles.value}>{submission.event.event_name}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{submission.event.date}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Time:</Text>
            <Text style={styles.value}>{`${submission.event.time_from} - ${submission.event.time_to}`}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{submission.event.location || 'N/A'}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Type of RS:</Text>
            <Text style={styles.value}>{submission.event.event_Type.name}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{submission.status || 'Pending'}</Text>
          </View>
          <View style={styles.divider} />
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
    color: '#343474',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#343474',
    textAlign: 'center',
    marginTop: 37
  },
})

