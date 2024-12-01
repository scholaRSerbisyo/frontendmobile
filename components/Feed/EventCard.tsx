import React from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Text } from '../ui/text'
import { Event } from '../types/event'
import { useRouter } from 'expo-router'

interface EventCardProps {
  event: Event
}

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const router = useRouter()

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push(`/event/${event.id}`)}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{event.date}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Start:</Text>
          <Text style={styles.value}>{event.startTime}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>End:</Text>
          <Text style={styles.value}>{event.endTime}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{event.location}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Type of Event:</Text>
          <Text style={styles.value}>{event.type}</Text>
        </View>
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        <Image 
          source={require('~/assets/images/scholars-cup-banner.png')}
          style={styles.image}
          resizeMode="cover"
        />

        <TouchableOpacity 
          onPress={() => router.push(`/event/${event.id}`)}
          style={styles.commentsContainer}
        >
          <Text style={styles.commentsLink}>
            View All Comments
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#191851',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#191851',
    fontWeight: '500',
    marginRight: 8,
  },
  value: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  commentsContainer: {
    marginTop: 4,
  },
  commentsLink: {
    color: '#FDB316',
    fontSize: 14,
    fontWeight: '600',
  },
})