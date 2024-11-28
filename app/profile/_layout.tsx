import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, StyleSheet } from 'react-native'
// import { Text } from '~/components/ui/text'
import { 
    Home, 
    Bell, 
    CircleUserRound } from 'lucide-react-native'
import HomeScreen from '../newsfeed/homescreen'
import NotificationsScreen from '../newsfeed/notificationscreen'
import ContentScreen from '../newsfeed/contentscreen'
import AboutUsScreen from './aboutus'

const Tab = createBottomTabNavigator()

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FDB316',
        tabBarInactiveTintColor: '#ffffff',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Bell color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Profile"
        component={ContentScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <CircleUserRound color={color} size={size} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Settings"
        component={AboutUsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <CircleUserRound color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#191851',
    borderTopWidth: 0,
    height: 60,
    paddingBottom: 5,
  },
})