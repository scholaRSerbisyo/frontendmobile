import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { Text } from '~/components/ui/text'
import { mockEvents } from '~/components/data/mock-events'
import { mockComments } from '~/components/data/mock-comments'
import { CommentItem } from '~/components/Feed/CommentItem'
import { BottomNavigation } from '~/components/Navigation/BottomNavigation'

export default function EventScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const event = mockEvents.find(e => e.id === id)

  if (!event) {
    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#343474" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Content</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{event.date}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Start:</Text>
            <Text style={styles.value}>{event.startTime}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>End:</Text>
            <Text style={styles.value}>{event.endTime}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{event.location}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Type of Event:</Text>
            <Text style={styles.value}>{event.type}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{event.description}</Text>
          </View>

          {event.image && (
            <Image 
              source={{ uri: event.image }}
              style={styles.image}
              resizeMode="cover"
            />
          )}

          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.attachButton}
              onPress={() => router.push('/submit-proof')}
            >
              <Text style={styles.attachButtonText}>Attach File</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.commentsHeader}>All comments</Text>
          
          {mockComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#343474',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343474',
    marginBottom: 16,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#343474',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  attachButton: {
    backgroundColor: '#F3BC00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  attachButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  commentsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343474',
    marginBottom: 12,
  },
})

