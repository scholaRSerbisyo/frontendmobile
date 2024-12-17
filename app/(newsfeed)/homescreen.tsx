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
import { SearchBar } from './searchbar'
import { ScreenName } from '~/components/Navigation/BottomNavigation'

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
  const [searchQuery, setSearchQuery] = useState('')

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
      <View style={styles.topheader}>
        <Image
          source={require('../../assets/images/2nd-type-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity 
          onPress={() => router.push('/calendar')}
          style={styles.calendarButton}
        >
          <CalendarDays size={24} color="#343474" />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search events..."
        />
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
        {loading ? (
          <ActivityIndicator size="large" color="#FDB316" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : events.length === 0 ? (
          <Text style={styles.noEventsText}>No events available</Text>
        ) : (
          events
            .filter(event => event.event_name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((event) => (
              <EventCard
                key={event.event_id}
                event={event}
              />
            ))
        )}
      </ScrollView>

      <BottomNavigation activeScreen={ScreenName.Home} />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  logo: {
    height: 40,
    width: 110,
  },
  calendarButton: {
    paddingHorizontal: 8,
    paddingTop: 10
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
  topheader: {
    flexDirection: 'row',
    paddingTop: 7,
    paddingHorizontal: 10,
    justifyContent: 'space-between'
  }
})

