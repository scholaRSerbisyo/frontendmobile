import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Text } from '../ui/text'
import { useRouter } from 'expo-router'
import { getImageUrl } from '../services/imageService'
import { Feather } from '@expo/vector-icons'
import { formatDistanceToNow, parse } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

interface Event {
  event_id: number
  event_image_uuid: string
  event_name: string
  description: string
  date: string
  time_from: string
  time_to: string
  location: string
  status: string
  admin_id: number
  event_type: {
    id: number
    name: string
  }
  school: {
    id: number
    name: string
  } | null
  barangay: {
    id: number
    name: string
  } | null
  created_at: string
  updated_at: string
}

export function EventCard({ event }: { event: Event }) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (event.event_image_uuid) {
      fetchImageUrl()
    } else {
      setLoading(false)
    }
  }, [event.event_image_uuid])

  const fetchImageUrl = async () => {
    const url = await getImageUrl(event.event_image_uuid)
    setImageUrl(url)
    setLoading(false)
  }

  const getTimeSinceCreation = () => {
    const createdDate = parse(event.created_at, 'yyyy-MM-dd HH:mm:ss', new Date())
    const zonedDate = toZonedTime(createdDate, 'Asia/Manila')
    return formatDistanceToNow(zonedDate, { addSuffix: true })
  }

  const handleViewComments = () => {
    router.push(`/newsfeed/${event.event_id}`)
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push(`/newsfeed/${event.event_id}`)}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{event.event_name}</Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Feather name="calendar" size={20} color="#191851" style={styles.icon} />
            <Text style={styles.detailText}>{event.date}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Feather name="clock" size={20} color="#191851" style={styles.icon} />
            <Text style={styles.detailText}>{`${event.time_from} to ${event.time_to}`}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Feather name="map-pin" size={20} color="#191851" style={styles.icon} />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.labelText}>Type of Event: </Text>
          <Text style={styles.valueText}>{event.event_type.name}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.labelText}>Description: </Text>
          <Text style={styles.descriptionText} numberOfLines={3}>
            {event.description}
          </Text>
        </View>

        {event.event_image_uuid && (
          loading ? (
            <ActivityIndicator size="large" color="#FDB316" style={styles.loader} />
          ) : (
            imageUrl && (
              <Image 
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            )
          )
        )}

        <View style={styles.footer}>
          <Text style={styles.createdAtText}>
            Created {getTimeSinceCreation()}
          </Text>
          <TouchableOpacity onPress={handleViewComments} style={styles.commentsButton}>
            <Text style={styles.commentsButtonText}>View All Comments</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F6F6',
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
    fontSize: 17,
    fontWeight: 'bold',
    color: '#191851',
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 12,
    width: 20,
  },
  detailText: {
    fontSize: 13,
    color: '#666666',
    flex: 1,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191851',
  },
  valueText: {
    fontSize: 13,
    color: '#666666',
    flex: 1,
  },
  descriptionText: {
    fontSize: 13,
    color: '#666666',
    flex: 1,
    lineHeight: 22,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
  },
  loader: {
    height: 180,
    marginBottom: 16,
  },
  footer: {
    marginTop: 8,
    borderBottomWidth: 3,
    borderBlockColor: '#FDB316'
  },
  createdAtText: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  commentsButton: {
    alignSelf: 'flex-start',
  },
  commentsButtonText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '500',
  },
})
