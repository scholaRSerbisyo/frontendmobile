import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Home, User, Bell } from 'lucide-react-native'

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

  const renderIcon = (Icon: typeof Home, screen: ScreenName) => {
    const isActive = activeScreen === screen
    return (
      <Icon
        size={24}
        color={getNavIconColor(screen)}
        fill={isActive ? '#F3BC00' : 'none'}
        strokeWidth={isActive ? 0 : 2}
      />
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/(newsfeed)/homescreen')}
      >
        {renderIcon(Home, ScreenName.Home)}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/(notification)/page')}
      >
        {renderIcon(Bell, ScreenName.Notifications)}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/(profile)/total-rs')}
      >
        {renderIcon(User, ScreenName.Profile)}
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
})

