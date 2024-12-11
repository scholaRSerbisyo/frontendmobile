import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { Text } from '~/components/ui/text'
import { NotificationSection } from './components/NotificationSection'
import { notifications } from './mock-data'
import { BottomNavigation } from '~/components/Navigation/BottomNavigation'

export default function NotificationsScreen() {
  const router = useRouter()

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

        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((section) => (
            <NotificationSection key={section.title} section={section} />
          ))}
        </ScrollView>
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
})

