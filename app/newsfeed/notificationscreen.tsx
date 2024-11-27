import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Text } from '~/components/ui/text'
// import { Avatar, AvatarImage } from '~/components/ui/avatar'

const notifications = [
  { id: 1, title: "Scholar's Cup", subtitle: 'Notif 1' },
  { id: 2, title: 'Kahupayan: Care Circle Kumustahan', subtitle: 'Notif 2' },
  { id: 3, title: 'Haguyhaguy', subtitle: 'Notif 3' },
  { id: 4, title: 'General Assembly', subtitle: 'Notif 4' },
  { id: 5, title: 'Pagkat-on: ISDA Checkpoint', subtitle: 'Notif 5' },
  { id: 6, title: 'ISDA Journey to the Shore', subtitle: 'Notif 6' },
  { id: 7, title: 'Barangay Youth Profiling', subtitle: 'Notif 7' },
]

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <ScrollView>
        {notifications.map((notif) => (
          <View key={notif.id} style={styles.notificationItem}>
            <View style={styles.notificationContent}>
              <Text style={styles.title}>{notif.title}</Text>
              <Text style={styles.subtitle}>{notif.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  notificationContent: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
})