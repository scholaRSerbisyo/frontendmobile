import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Home, User, Bell } from 'lucide-react-native'
import { Text } from '../ui/text'

export enum ScreenName {
  Home = 'Home',
  Notifications = 'Notifications',
  Profile = 'Profile'
}

interface BottomNavigationProps {
  activeScreen: ScreenName
}

export function BottomNavigation({ activeScreen }: BottomNavigationProps) {
  const router = useRouter()

  const getNavIconColor = (screen: ScreenName) =>
    activeScreen === screen ? '#F3BC00' : '#FFFFFF'

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/newsfeed/homescreen')}
      >
        <Home size={24} color={getNavIconColor(ScreenName.Home)} />
        <Text style={[styles.navText, activeScreen === ScreenName.Home && styles.activeNavText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/(notification)/page')}
      >
        <Bell size={24} color={getNavIconColor(ScreenName.Notifications)} />
        <Text style={[styles.navText, activeScreen === ScreenName.Notifications && styles.activeNavText]}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/(profile)/total-rs')}
      >
        <User size={24} color={getNavIconColor(ScreenName.Profile)} />
        <Text style={[styles.navText, activeScreen === ScreenName.Profile && styles.activeNavText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#343474', 
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
    color: '#F3BC00',
  },
})

