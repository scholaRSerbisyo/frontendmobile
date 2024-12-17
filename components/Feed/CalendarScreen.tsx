import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import { ChevronLeft, ChevronRight, Bell, Home, User, X } from 'lucide-react-native'
import { Text } from '~/components/ui/text'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import API_URL from '~/constants/constants'
import { format, parse, isWithinInterval, set, startOfDay } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { BottomNavigation, ScreenName } from '~/components/Navigation/BottomNavigation'
import { useRouter } from 'expo-router'

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
        return '#34C759'  // green
      case 'upcoming':
        return '#0F0E44'  // blue
      case 'previous':
        return '#FFCC00'  // yellow
      default:
        return '#1E88E5'  // Blue as default
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

  const handleBack = () => {
    router.back()
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
                <ChevronLeft size={24} color={currentEventIndex > 0 ? "#343474" : "#CCCCCC"} />
              </TouchableOpacity>
              <Text style={styles.dateText}>{formatDate(event.date)}</Text>
              <TouchableOpacity 
                onPress={handleNextEvent} 
                disabled={currentEventIndex === allEvents.length - 1}
                style={[styles.chevronButton, currentEventIndex === allEvents.length - 1 && styles.disabledChevron]}
              >
                <ChevronRight size={24} color={currentEventIndex < allEvents.length - 1 ? "#343474" : "#CCCCCC"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowEventDetails(false)} style={styles.closeButton}>
                <X size={20} color="#343474" />
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calendar</Text>
        </View>

        <Calendar
          style={[styles.calendar, {
            backgroundColor: '#2A2A5C',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            marginBottom: 0,
            paddingTop: 0,
          }]}
          theme={{
            backgroundColor: 'white',
            calendarBackground: 'white',
            textSectionTitleColor: '#FFFFFF',
            selectedDayBackgroundColor: '#FDB316',
            selectedDayTextColor: '#2A2A5C',
            todayTextColor: '#343474',
            dayTextColor: '#343474',
            textDisabledColor: '#CCCCCC',
            dotColor: '#343474',
            selectedDotColor: '#2A2A5C',
            arrowColor: '#FFFFFF',
            monthTextColor: '#2A2A5C',
            textMonthFontSize: 24,
            textMonthFontWeight: 'bold',
            textDayFontSize: 16,
            textDayHeaderFontSize: 14,
            'stylesheet.calendar.header': {
              week: {
                marginTop: 0,
                marginBottom: 5,
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingHorizontal: 10,
                backgroundColor: '#2A2A5C',
              },
              monthText: {
                fontSize: 24,
                color: 'white', 
                fontWeight: '700',
                margin: 5,
              },
              dayHeader: {
                color: '#FFFFFF',
                fontWeight: '400',
                fontSize: 12,
                marginBottom: 5,
              },
            },
            'stylesheet.calendar.main': {
              week: {
                marginTop: 0,
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: '#FFFFFF',
                paddingVertical: 10,
              },
              container: {
                backgroundColor: '#FFFFFF',
                paddingTop: 10,
              },
              dayContainer: {
                flex: 1,
                alignItems: 'center',
              }
            },
          }}
          current={currentMonth}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          markingType={'dot'}
          markedDates={getMarkedDates()}
          renderArrow={(direction) => (
            direction === 'left' ? <ChevronLeft color="#FFFFFF" size={26} /> : <ChevronRight color="#FFFFFF" size={26} />
          )}
          customStyle={{
            'stylesheet.calendar.main': {
              container: {
                paddingLeft: 0,
                paddingRight: 0,
              },
            },
          }}
        />
      </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
            <Text style={styles.legendText}>Today's Return Service</Text>
            <Text style={styles.legendTime}>30min.</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#0F0E44' }]} />
            <Text style={styles.legendText}>Upcoming Return Service</Text>
            <Text style={styles.legendTime}>60min.</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFCC00' }]} />
            <Text style={styles.legendText}>Previous Return Service</Text>
            <Text style={styles.legendTime}>30min.</Text>
          </View>
        </View>

        {renderEventDetails()}
      </ScrollView>

      <BottomNavigation currentScreen={ScreenName.Calendar} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
      topSection: {
        backgroundColor: '#2A2A5C',
      },
      content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        margin: 16,
      },
      backButton: {
        position: 'absolute',
        left: 16,
        top: 16,
      },
      backButtonText: {
        fontSize: 18,
        color: '#FDB316',
        fontWeight: '600',
      },
      headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        paddingTop: 10
      },
      calendar: {
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
      },
  legend: {
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    fontSize: 16,
    color: '#1A1B3B',
    flex: 1,
  },
  legendTime: {
    fontSize: 16,
    color: '#666666',
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
  eventDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#343474',
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
  disabledChevron: {
    opacity: 0.5,
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
    fontSize: 14,
    color: '#343474',
    fontWeight: '400',
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
    color: '#FFCC00',
  },
  ongoing: {
    color: '#34C759',
  },
  upcoming: {
    color: '#0F0E44',
  },
})

