import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { Text } from '~/components/ui/text'
import { NotificationSection } from './components/NotificationSection'
import { notifications } from './mock-data'

export default function NotificationsScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#191851" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView style={styles.content}>
        {notifications.map((section) => (
          <NotificationSection key={section.title} section={section} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#191851',
  },
  content: {
    flex: 1,
  },
})

