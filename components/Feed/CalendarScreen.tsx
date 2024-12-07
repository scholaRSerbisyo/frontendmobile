import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { Calendar, DateData } from 'react-native-calendars'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import { Text } from '../ui/text'
import { SafeAreaView } from 'react-native-safe-area-context'
import CalendarEventModal from './components/CalendarEventModal'
import { BottomNavigation } from '../Navigation/BottomNavigation'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import API_URL from '~/constants/constants'
import { format, parse, isWithinInterval, set, startOfDay, addMonths, subMonths } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

type Event = {
  event_id: number
  event_image_uuid: string
  event_name: string
  description: string
  date: string
  time_from: string
  time_to: string
  location: string
  status: 'previous' | 'ongoing' | 'upcoming'
  admin_id: number
  event_type: {
    event_type_id: number
    name: string
  }
  school: {
    school_id: number
    school_name: string
  } | null
  barangay: {
    baranggay_id: number
    baranggay_name: string
  } | null
  created_at: string
  updated_at: string
}

const TIMEZONE = 'Asia/Manila'
const { width: SCREEN_WIDTH } = Dimensions.get('window')

export function CalendarScreen() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [events, setEvents] = useState<{ [key: string]: Event[] }>({})
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.get(`${API_URL}/events/getevents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const fetchedEvents = response.data
      const formattedEvents = formatEvents(fetchedEvents)
      setEvents(formattedEvents)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const formatEvents = (fetchedEvents: Event[]): { [key: string]: Event[] } => {
    const formattedEvents: { [key: string]: Event[] } = {}
    const currentDate = toZonedTime(new Date(), TIMEZONE)

    fetchedEvents.forEach(event => {
      try {
        const eventDate = toZonedTime(parse(event.date, 'yyyy-MM-dd', new Date()), TIMEZONE)
        const eventTimeFrom = toZonedTime(parse(`${event.date} ${event.time_from}`, 'yyyy-MM-dd HH:mm:ss', new Date()), TIMEZONE)
        const eventTimeTo = toZonedTime(parse(`${event.date} ${event.time_to}`, 'yyyy-MM-dd HH:mm:ss', new Date()), TIMEZONE)

        let status: 'previous' | 'ongoing' | 'upcoming'
        if (eventDate < startOfDay(currentDate)) {
          status = 'previous'
        } else if (eventDate > currentDate) {
          status = 'upcoming'
        } else {
          if (isWithinInterval(currentDate, { start: eventTimeFrom, end: eventTimeTo })) {
            status = 'ongoing'
          } else if (currentDate < eventTimeFrom) {
            status = 'upcoming'
          } else {
            status = 'previous'
          }
        }

        const formattedEvent: Event = {
          ...event,
          status: status
        }

        const dateKey = format(eventDate, 'yyyy-MM-dd')
        if (formattedEvents[dateKey]) {
          formattedEvents[dateKey].push(formattedEvent)
        } else {
          formattedEvents[dateKey] = [formattedEvent]
        }
      } catch (error) {
        console.error(`Error formatting event: ${event.event_id}`, error)
      }
    })

    return formattedEvents
  }

  const getMarkedDates = () => {
    const markedDates: any = {}
    Object.keys(events).forEach(date => {
      const dayEvents = events[date]
      markedDates[date] = {
        marked: true,
        dotColor: getEventColor(dayEvents[0].status),
        selected: date === selectedDate,
        selectedColor: '#FDB316',
      }
    })
    return markedDates
  }

  const getEventColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return '#34C759'
      case 'upcoming':
        return '#007AFF'
      case 'previous':
        return '#FF3B30'
      default:
        return '#007AFF'
    }
  }

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString)
    const selectedEvents = events[day.dateString]
    if (selectedEvents && selectedEvents.length > 0) {
      setSelectedEvent(selectedEvents[0])
      setShowEventDetails(true)
    } else {
      setSelectedEvent(null)
      setShowEventDetails(false)
    }
  }

  const handleMonthChange = (month: DateData) => {
    setCurrentMonth(month.dateString.substring(0, 7))
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentDate = parse(currentMonth, 'yyyy-MM', new Date())
    const newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1)
    setCurrentMonth(format(newDate, 'yyyy-MM'))
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#191851" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calendar</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={() => navigateMonth('prev')}>
            <ChevronLeft size={24} color="#191851" />
          </TouchableOpacity>
          <Text style={styles.monthYearText}>
            {format(parse(currentMonth, 'yyyy-MM', new Date()), 'MMMM yyyy')}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth('next')}>
            <ChevronRight size={24} color="#191851" />
          </TouchableOpacity>
        </View>

        <Calendar
          style={styles.calendar}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#191851',
            selectedDayBackgroundColor: '#FDB316',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#FDB316',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            monthTextColor: '#191851',
            textDayFontFamily: 'System',
            textMonthFontFamily: 'System',
            textDayHeaderFontFamily: 'System',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16
          }}
          current={currentMonth}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          markingType={'custom'}
          markedDates={getMarkedDates()}
          hideArrows={true}
        />

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
            <Text style={styles.legendText}>Ongoing</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#007AFF' }]} />
            <Text style={styles.legendText}>Upcoming</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
            <Text style={styles.legendText}>Previous</Text>
          </View>
        </View>
      </ScrollView>

      <CalendarEventModal
        visible={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        selectedDate={selectedDate}
        event={selectedEvent}
      />

      <BottomNavigation />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#191851',
  },
  placeholder: {
    width: 40,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#191851',
  },
  calendar: {
    marginBottom: 20,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#191851',
  },
})

