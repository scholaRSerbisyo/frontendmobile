import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { Text } from '~/components/ui/text'
import { NotificationSection } from './components/NotificationSection'
import { BottomNavigation } from '~/components/Navigation/BottomNavigation'
import { Notification } from './types'
import { fetchNotifications, markNotificationAsRead } from './api'

export default function NotificationsScreen() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    setIsLoading(true)
    try {
      const fetchedNotifications = await fetchNotifications()
      setNotifications(fetchedNotifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationPress = async (notification: Notification) => {
    try {
      await markNotificationAsRead(notification.id)
      // Update the local state to reflect the change
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      )
      // Navigate to the event details or perform any other action
      // router.push(`/event/${notification.data.eventId}`)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  // Group notifications by date
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const date = new Date(notification.data.date).toDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(notification)
    return acc
  }, {} as Record<string, Notification[]>)

  const sections = Object.entries(groupedNotifications).map(([date, notifications]) => ({
    title: date,
    data: notifications
  }))

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <ChevronLeft size={36} color="#FDB316" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading notifications...</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.content} 
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {sections.map((section) => (
              <NotificationSection 
                key={section.title} 
                section={section} 
                onNotificationPress={handleNotificationPress}
              />
            ))}
          </ScrollView>
        )}
        <View style={styles.yellowLine} />
        <BottomNavigation />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 36,
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
    color: '#191851',
    textAlign: 'center',
    flex: 1,
    marginTop: 10,
    paddingTop: 16,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80,
  },
  yellowLine: {
    height: 4,
    backgroundColor: '#FDB316',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

