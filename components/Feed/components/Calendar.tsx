import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { CalendarEventModal } from './CalendarEventModal';
import { User, Home, Bell } from 'lucide-react-native';
import { router } from 'expo-router';
type EventType = 'today' | 'upcoming' | 'previous';

interface DayEvent {
  type: EventType;
  duration: string;
}

interface CalendarDay {
  date: number;
  events?: DayEvent[];
}

export function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Example calendar data
  const calendarData: CalendarDay[] = Array.from({ length: 31 }, (_, i) => ({
    date: i + 1,
    events: i === 6 ? [{ type: 'previous', duration: '30min.' }] :
            i === 12 ? [{ type: 'today', duration: '30min.' }] :
            i === 14 ? [{ type: 'upcoming', duration: '60min.' }] : undefined
  }));

  const handleDayPress = (date: number) => {
    setSelectedDate(new Date(2024, 0, date)); // January 2024
    setModalVisible(true);
  };

  const renderDot = (type: EventType) => {
    const dotColor = type === 'today' ? '#007AFF' : 
                    type === 'upcoming' ? '#4CAF50' : 
                    '#FF3B30';
    return <View style={[styles.dot, { backgroundColor: dotColor }]} />;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
  {/* Back Button */}
  <TouchableOpacity
    onPress={() => router.back()}
    style={styles.backButton}
  >
    <Text style={styles.backText}>Back</Text>
  </TouchableOpacity>

  {/* Title */}
  <Text style={styles.title}>Calendar</Text>

  {/* Profile Button */}
  <TouchableOpacity
    onPress={() => router.push('/(profile)aboutus')}
    style={styles.profileButton}
  >
    <Text style={styles.profileText}>Profile</Text>
  </TouchableOpacity>
</View>


      {/* Month */}
      <Text style={styles.month}>January</Text>

      {/* Days of week */}
      <View style={styles.weekDays}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <Text key={day} style={styles.weekDay}>{day}</Text>
        ))}
      </View>

      {/* Calendar grid */}
      <ScrollView style={styles.calendarContainer}>
        <View style={styles.calendar}>
          {calendarData.map((day, index) => (
            <TouchableOpacity
              key={day.date}
              style={styles.day}
              onPress={() => handleDayPress(day.date)}
            >
              <Text style={styles.dayText}>{day.date}</Text>
              {day.events?.map((event, i) => (
                <View key={i} style={styles.eventContainer}>
                  {renderDot(event.type)}
                </View>
              ))}
            </TouchableOpacity>
          ))}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#007AFF' }]} />
            <Text style={styles.legendText}>Today's Return Service</Text>
            <Text style={styles.duration}>30min.</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Upcoming Return Service</Text>
            <Text style={styles.duration}>60min.</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
            <Text style={styles.legendText}>Previous Return Service</Text>
            <Text style={styles.duration}>30min.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Bell size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Home size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <User size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Event Modal */}
      {selectedDate && (
        <EventModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          selectedDate={selectedDate}
          onPrevDay={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
          onNextDay={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
        />
      )}
    </View>
  );
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
    padding: 40,
    backgroundColor: '#343474',
  },
  backButton: {
    padding: 5,
  },
  backText: {
    color: '#fff',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  profileButton: {
    padding: 5,
  },
  profileText: {
    color: '#fff',
  },
  month: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 15,
    backgroundColor: '#343474',
    color: '#fff',
  },
  weekDays: {
    flexDirection: 'row',
    backgroundColor: '#343474',
    paddingBottom: 10,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
  },
  calendarContainer: {
    flex: 1,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  day: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  dayText: {
    fontSize: 16,
    marginBottom: 5,
  },
  eventContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legend: {
    padding: 15,
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    flex: 1,
  },
  duration: {
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#343474',
  },
  navItem: {
    padding: 5,
  },
});

