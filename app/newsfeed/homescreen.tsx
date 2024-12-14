import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Calendar, CalendarDays } from 'lucide-react-native'
import { Text } from '~/components/ui/text'
import { EventCard } from '~/components/Feed/EventCard'
import { BottomNavigation } from '~/components/Navigation/BottomNavigation'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { parseISO } from 'date-fns'
import API_URL from '~/constants/constants'

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

export default function HomeScreen() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async (showLoader = true) => {
    if (showLoader) setLoading(true)
    setError(null)
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.get<Event[]>(`${API_URL}/events/getevents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setEvents(response.data.sort((a, b) => parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime()))
    } catch (err) {
      console.error('Error fetching events:', err)
      setError('Failed to fetch events. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchEvents(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/scholarserbisyoupperlogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity 
          onPress={() => router.push('/calendar')}
          style={styles.calendarButton}
        >
          <CalendarDays size={24} color="#FDB316" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FDB316"]}
          />
        }
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Home</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#FDB316" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : events.length === 0 ? (
          <Text style={styles.noEventsText}>No events available</Text>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.event_id}
              event={event}
            />
          ))
        )}
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  logo: {
    height: 32,
    width: 150,
  },
  calendarButton: {
    padding: 8,
  },
  titleContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#191851',
    paddingTop: 10,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  noEventsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666666',
  },
})

