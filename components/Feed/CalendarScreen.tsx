import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native'
import { useRouter } from 'expo-router'
import { Calendar, DateData } from 'react-native-calendars'
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native'
import { Text } from '../ui/text'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BottomNavigation } from '../Navigation/BottomNavigation'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import API_URL from '~/constants/constants'
import { format, parse, isWithinInterval, set, startOfDay } from 'date-fns'
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
  const [events, setEvents] = useState<{ [key: string]: Event[] }>({})
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [currentEventIndex, setCurrentEventIndex] = useState<number | null>(null)
  const [showEventDetails, setShowEventDetails] = useState(false)

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
      setAllEvents(Object.values(formattedEvents).flat())
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
        const [fromHour, fromMinute] = event.time_from.split(':').map(Number)
        const [toHour, toMinute] = event.time_to.split(':').map(Number)
        
        const eventTimeFrom = set(eventDate, { hours: fromHour, minutes: fromMinute })
        const eventTimeTo = set(eventDate, { hours: toHour, minutes: toMinute })

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

  const findEventIndex = (eventId: number) => {
    return allEvents.findIndex(event => event.event_id === eventId)
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
    const dayEvents = events[day.dateString] || []
    if (dayEvents.length > 0) {
      const firstEventIndex = findEventIndex(dayEvents[0].event_id)
      setCurrentEventIndex(firstEventIndex)
      setShowEventDetails(true)
    } else {
      setCurrentEventIndex(null)
      setShowEventDetails(false)
    }
  }

  const handleMonthChange = (month: DateData) => {
    setCurrentMonth(month.dateString)
  }

  const handlePreviousEvent = () => {
    if (currentEventIndex !== null && currentEventIndex > 0) {
      setCurrentEventIndex(currentEventIndex - 1)
    }
  }

  const handleNextEvent = () => {
    if (currentEventIndex !== null && currentEventIndex < allEvents.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1)
    }
  }

  const formatDate = (dateString: string) => {
    return format(parse(dateString, 'yyyy-MM-dd', new Date()), 'MMMM d yyyy')
  }

  const formatTime = (timeString: string) => {
    let date = parse(timeString, 'HH:mm:ss', new Date())
    if (isNaN(date.getTime())) {
      date = parse(timeString, 'HH:mm', new Date())
    }
    if (isNaN(date.getTime())) {
      return timeString
    }
    return format(date, 'h:mm a')
  }

  const renderEventDetails = () => {
    if (!showEventDetails || currentEventIndex === null || allEvents.length === 0) return null

    const event = allEvents[currentEventIndex]
    const currentDate = toZonedTime(new Date(), TIMEZONE)
    const eventDate = toZonedTime(parse(event.date, 'yyyy-MM-dd', new Date()), TIMEZONE)
    const [fromHour, fromMinute] = event.time_from.split(':').map(Number)
    const [toHour, toMinute] = event.time_to.split(':').map(Number)
    
    const eventTimeFrom = set(eventDate, { hours: fromHour, minutes: fromMinute })
    const eventTimeTo = set(eventDate, { hours: toHour, minutes: toMinute })

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

    return (
      <Modal
        transparent={true}
        visible={showEventDetails}
        onRequestClose={() => setShowEventDetails(false)}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            { borderColor: getEventColor(status), borderWidth: 1 }
          ]}>
            <View style={styles.eventDetailsHeader}>
              <TouchableOpacity 
                onPress={handlePreviousEvent} 
                disabled={currentEventIndex === 0}
                style={[styles.chevronButton, currentEventIndex === 0 && styles.disabledChevron]}
              >
                <ChevronLeft size={24} color={currentEventIndex > 0 ? "#191851" : "#CCCCCC"} />
              </TouchableOpacity>
              <Text style={styles.dateText}>{formatDate(event.date)}</Text>
              <TouchableOpacity 
                onPress={handleNextEvent} 
                disabled={currentEventIndex === allEvents.length - 1}
                style={[styles.chevronButton, currentEventIndex === allEvents.length - 1 && styles.disabledChevron]}
              >
                <ChevronRight size={24} color={currentEventIndex < allEvents.length - 1 ? "#191851" : "#CCCCCC"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowEventDetails(false)} style={styles.closeButton}>
                <X size={20} color="#191851" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.eventDetailsContent}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Event Title:</Text>
                <Text style={styles.value}>{event.event_name}</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Start:</Text>
                <Text style={styles.value}>{formatTime(event.time_from)}</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>End:</Text>
                <Text style={styles.value}>{formatTime(event.time_to)}</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Location:</Text>
                <Text style={styles.value}>{event.location}</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Type of Event:</Text>
                <Text style={styles.value}>{event.event_type.name}</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.value}>{event.description}</Text>
              </View>

              <View style={styles.statusContainer}>
                <Text style={[styles.statusText, styles[status]]}>
                  {status === 'previous' ? 'Previous Return Service' : 
                   status === 'ongoing' ? 'Ongoing Return Service' : 
                   'Upcoming Return Service'}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#191851" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calendar</Text>
          <View style={styles.placeholder} />
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
            textDayHeaderFontSize: 16,
            arrowColor: '#191851',
          }}
          current={currentMonth}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          markingType={'custom'}
          markedDates={getMarkedDates()}
          hideArrows={false}
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

        {renderEventDetails()}
      </ScrollView>

      <BottomNavigation />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    marginTop: 30,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#191851',
  },
  placeholder: {
    width: 40,
  },
  calendar: {
    marginVertical: 40,
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
  eventDetailsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingRight: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#191851',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
  },
  chevronButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDetailsContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#191851',
    fontWeight: '500',
  },
  statusContainer: {
    marginTop: 24,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  previous: {
    color: '#FF3B30',
  },
  ongoing: {
    color: '#34C759',
  },
  upcoming: {
    color: '#007AFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 3,
  },
  disabledChevron: {
    opacity: 0.5,
  },
})

