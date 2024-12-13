import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { Home, User, Bell } from 'lucide-react-native'
import { Text } from '../ui/text'

export function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/newsfeed/homescreen')}
      >
        <Home
          size={24}
          color={pathname.includes('/newsfeed') ? '#FDB316' : '#FFFFFF'}
        />
        <Text style={[styles.navText, pathname.includes('/(notification)') && styles.activeNavText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/(profile)/total-rs')}
      >
        <Bell
          size={24}
          color={pathname.includes('/(notification)') ? '#FDB316' : '#FFFFFF'}
        />
        <Text style={[styles.navText, pathname.includes('/newsfeed') && styles.activeNavText]}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/(notification)/page')}
      >
        <User
          size={24}
          color={pathname.includes('/(profile)') ? '#FDB316' : '#FFFFFF'}
        />
        <Text style={[styles.navText, pathname.includes('/(profile)') && styles.activeNavText]}>Profile</Text>
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
  activeNavText: {
    color: '#FDB316',
  },
})

