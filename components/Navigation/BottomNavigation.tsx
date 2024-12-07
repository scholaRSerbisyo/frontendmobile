import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { Calendar, Home, User, Bell } from 'lucide-react-native'
import { Text
 } from '../ui/text'

export function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/(notification)/page')}
      >
        <Bell
          size={24}
          color={pathname === '/calendar' ? '#FDB316' : '#FFFFFF'}
        />
        <Text style={styles.navText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/newsfeed/homescreen')}
      >
        <Home
          size={24}
          color={pathname === '/home' ? '#FDB316' : '#FFFFFF'}
        />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/(profile)/total-rs')}
      >
        <User
          size={24}
          color={pathname === '/profile' ? '#FDB316' : '#FFFFFF'}
        />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#191851',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButton: {
    padding: 10,
    alignItems: 'center',
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
})

