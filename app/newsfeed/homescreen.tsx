import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Calendar } from 'lucide-react-native'
import { Text } from '~/components/ui/text'
import { EventCard } from '~/components/Feed/EventCard'
import { mockEvents } from '~/components/data/mock-events'
import { BottomNavigation } from '~/components/Navigation/BottomNavigation'

export default function HomeScreen() {
  const router = useRouter()

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
          <Calendar size={24} color="#FDB316" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Home</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {mockEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
          />
        ))}
      </ScrollView>

      <BottomNavigation />
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
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#191851',
    paddingTop: 10
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
  },
})



