import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Calendar } from 'react-native-calendars'
import { ChevronLeft, Home, Calendar as CalendarIcon, User } from 'lucide-react-native'
import { Text } from '../ui/text'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CalendarEventModal } from '../Authentication/components/CalendarEventModal'
type Event = {
  id: string
  title: string
  location: string
  time: string
  type: 'today' | 'upcoming' | 'previous'
  duration: string
}

export function CalendarScreen() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState('')
  const [showEventDetails, setShowEventDetails] = useState(false)

  // Sample events data
  const events: { [key: string]: Event } = {
    '2024-01-12': {
      id: '1',
      title: "Today's Return Service",
      location: 'City Hall',
      time: '9:00 AM',
      type: 'today',
      duration: '30min',
    },
    '2024-01-07': {
      id: '2',
      title: 'Previous Return Service',
      location: 'Library',
      time: '2:00 PM',
      type: 'previous',
      duration: '30min',
    },
    '2024-01-10': {
      id: '3',
      title: 'Previous Return Service',
      location: 'Community Center',
      time: '10:00 AM',
      type: 'previous',
      duration: '30min',
    },
    '2024-01-15': {
      id: '4',
      title: 'Upcoming Return Service',
      location: 'City Hall',
      time: '1:00 PM',
      type: 'upcoming',
      duration: '60min',
    },
    '2024-01-21': {
      id: '5',
      title: 'Upcoming Return Service',
      location: 'Library',
      time: '3:00 PM',
      type: 'upcoming',
      duration: '60min',
    },
    '2024-01-24': {
      id: '6',
      title: 'Upcoming Return Service',
      location: 'Community Center',
      time: '11:00 AM',
      type: 'upcoming',
      duration: '60min',
    },
    '2024-01-30': {
      id: '7',
      title: 'Upcoming Return Service',
      location: 'City Hall',
      time: '2:00 PM',
      type: 'upcoming',
      duration: '60min',
    },
  }

  const markedDates = Object.keys(events).reduce((acc, date) => {
    const event = events[date]
    let dotColor
    switch (event.type) {
      case 'today':
        dotColor = '#007AFF'
        break
      case 'upcoming':
        dotColor = '#34C759'
        break
      case 'previous':
        dotColor = '#FF3B30'
        break
      default:
        dotColor = '#007AFF'
    }
    
    return {
      ...acc,
      [date]: {
        marked: true,
        dotColor,
        selected: date === selectedDate,
        selectedColor: '#191851',
      },
    }
  }, {})

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString)
    setShowEventDetails(true)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <ChevronLeft size={24} color="#FFFFFF" />
            <Text style={styles.headerButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calendar</Text>
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.headerButton}>
            <Text style={styles.headerButtonTextRight}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            style={styles.calendar}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#191851',
              selectedDayBackgroundColor: '#191851',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#191851',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              monthTextColor: '#191851',
              textMonthFontWeight: 'bold',
              textDayFontSize: 16,
              textMonthFontSize: 18,
            }}
            markedDates={markedDates}
            onDayPress={handleDayPress}
          />
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#007AFF' }]} />
            <Text style={styles.legendText}>Today's Return Service</Text>
            <Text style={styles.legendDuration}>30min.</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
            <Text style={styles.legendText}>Upcoming Return Service</Text>
            <Text style={styles.legendDuration}>60min.</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
            <Text style={styles.legendText}>Previous Return Service</Text>
            <Text style={styles.legendDuration}>30min.</Text>
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/calendar')}>
            <CalendarIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/home')}>
            <Home size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/profile')}>
            <User size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Event Details Modal */}
        <CalendarEventModal
          visible={showEventDetails}
          onClose={() => setShowEventDetails(false)}
          selectedDate={selectedDate}
          event={events[selectedDate] || null}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191851',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#191851',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 4,
  },
  headerButtonTextRight: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    overflow: 'hidden',
  },
  calendar: {
    borderWidth: 0,
  },
  legend: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    color: '#191851',
  },
  legendDuration: {
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#191851',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    padding: 8,
  },
})
