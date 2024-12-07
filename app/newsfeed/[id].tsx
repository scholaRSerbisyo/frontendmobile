import React, { useState, useEffect } from 'react'
import { View, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Modal, SafeAreaView } from 'react-native'
import { Text } from '~/components/ui/text'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ChevronLeft, MessageCircle, X } from 'lucide-react-native'
import { getImageUrl } from '~/components/services/imageService'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import API_URL from '~/constants/constants'
import { format, parseISO, formatDistanceToNow, isWithinInterval, parse, set, startOfDay, isSameDay } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

interface Event {
  event_id: number
  event_image_uuid: string
  event_name: string
  description: string
  date: string
  time_from: string
  time_to: string
  location: string
  status: string
  admin_id: number
  event_type: {
    id: number
    name: string
  }
  school: {
    id: number
    name: string
  } | null
  barangay: {
    id: number
    name: string
  } | null
  created_at: string
  updated_at: string
}

interface Comment {
  id: number
  user_name: string
  text: string
  created_at: string
}

export default function ContentScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false)
  const [hasExistingSubmission, setHasExistingSubmission] = useState(false)

  useEffect(() => {
    fetchEvent()
    fetchComments()
  }, [id])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = await SecureStore.getItemAsync('authToken')
      if (!token) {
        throw new Error('No authentication token found')
      }
      const response = await axios.get<Event>(`${API_URL}/events/getevent/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setEvent(response.data)
      if (response.data.event_image_uuid) {
        const url = await getImageUrl(response.data.event_image_uuid)
        setImageUrl(url)
      }
      await checkExistingSubmission()
    } catch (error) {
      console.error('Error fetching event:', error)
      setError('Failed to load event details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    // This is a placeholder function. In a real app, you would fetch comments from your API.
    const dummyComments: Comment[] = [
      { id: 1, user_name: "Scholar's Name", text: "scholar's concern", created_at: "2023-06-01T12:00:00Z" },
      { id: 2, user_name: "Coordinator's Name", text: "coordinator's reply", created_at: "2023-06-01T13:00:00Z" },
    ]
    setComments(dummyComments)
  }

  const checkExistingSubmission = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      if (!token) throw new Error('No authentication token found')
      const response = await axios.get(`${API_URL}/events/check-submission/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setHasExistingSubmission(response.data.hasSubmission)
    } catch (error) {
      console.error('Error checking existing submission:', error)
    }
  }

  const handleCommentSubmit = async () => {
    if (commentText.trim() === '') return

    // This is a placeholder function. In a real app, you would send the comment to your API.
    const newComment: Comment = {
      id: comments.length + 1,
      user_name: 'Current User', // You would get this from your auth system
      text: commentText,
      created_at: new Date().toISOString(),
    }

    setComments([...comments, newComment])
    setCommentText('')
    setIsCommentModalVisible(false)
  }

  const formatDate = (dateString: string) => {
    const date = toZonedTime(parse(dateString, 'yyyy-MM-dd', new Date()), 'Asia/Manila')
    return format(date, 'MMMM d, yyyy')
  }

  const formatTime = (timeString: string) => {
    // Extract only the time part if the format is 'Y-m-d H:i:s'
    const timePart = timeString.split(' ')[1] || timeString;
    const [hours, minutes] = timePart.split(':').map(Number);
    const time = toZonedTime(set(new Date(), { hours, minutes }), 'Asia/Manila');
    return format(time, 'h:mm a');
  }

  const getTimeSinceCreation = (createdAt: string) => {
    const date = toZonedTime(parseISO(createdAt), 'Asia/Manila')
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const isEventActive = (event: Event) => {
    const now = toZonedTime(new Date(), 'Asia/Manila')
    const eventDate = toZonedTime(parse(event.date, 'yyyy-MM-dd', new Date()), 'Asia/Manila')

    // Extract only the time part from time_from and time_to
    const timeFrom = event.time_from.split(' ')[1] || event.time_from
    const timeTo = event.time_to.split(' ')[1] || event.time_to

    const [fromHour, fromMinute] = timeFrom.split(':').map(Number)
    const [toHour, toMinute] = timeTo.split(':').map(Number)

    const eventTimeFrom = set(eventDate, { hours: fromHour, minutes: fromMinute })
    const eventTimeTo = set(eventDate, { hours: toHour, minutes: toMinute })

    // Check if the event is today or in the future
    if (eventDate >= startOfDay(now)) {
      // If the event is today, check if it's within the time range
      if (isSameDay(eventDate, now)) {
        return isWithinInterval(now, { start: eventTimeFrom, end: eventTimeTo })
      } else {
        // If the event is in the future, consider it as active
        return true
      }
    } else {
      // If the event is in the past, it's not active
      return false
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FDB316" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Event not found.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.contentCard}>
          <Text style={styles.eventTitle}>{event.event_name}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailText}>{formatDate(event.date)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time:</Text>
              <Text style={styles.detailText}>{`${formatTime(event.time_from)} to ${formatTime(event.time_to)}`}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailText}>{event.location}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type of Event:</Text>
              <Text style={styles.detailText}>{event.event_type.name}</Text>
            </View>

            {event.school && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>School:</Text>
                <Text style={styles.detailText}>{event.school.name}</Text>
              </View>
            )}

            {event.barangay && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Barangay:</Text>
                <Text style={styles.detailText}>{event.barangay.name}</Text>
              </View>
            )}

            <View style={styles.descriptionContainer}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={styles.descriptionText}>{event.description}</Text>
            </View>
          </View>

          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.eventImage}
              resizeMode="cover"
            />
          )}

          <View style={styles.commentsSection}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>All comments</Text>
              {isEventActive(event) && !hasExistingSubmission && (
                <TouchableOpacity 
                  style={styles.attachButton}
                  onPress={() => router.push(`/(proof)/submit-proof?id=${id}`)}
                >
                  <Text style={styles.attachButtonText}>Attach File</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity 
              style={styles.commentInputFrame}
              onPress={() => setIsCommentModalVisible(true)}
            >
              <Text style={styles.commentInputPlaceholder}>Write a comment...</Text>
            </TouchableOpacity>

            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentThread}>
                <View style={styles.comment}>
                  <Text style={styles.commentName}>{comment.user_name}</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <Text style={styles.commentTime}>{getTimeSinceCreation(comment.created_at)}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.createdAtText}>
            Created {getTimeSinceCreation(event.created_at)}
          </Text>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCommentModalVisible}
        onRequestClose={() => setIsCommentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Comment</Text>
              <TouchableOpacity onPress={() => setIsCommentModalVisible(false)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalCommentInput}
              multiline
              numberOfLines={4}
              placeholder="Write your comment here..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleCommentSubmit}>
              <Text style={styles.submitButtonText}>Post Comment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    marginTop: 35,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    marginLeft: 110,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  contentCard: {
    padding: 16,
  },
  eventTitle: {
    paddingTop: 10,
    fontSize: 19,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
    width: 100,
  },
  detailText: {
    fontSize: 13,
    color: '#666666',
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
    lineHeight: 24,
  },
  eventImage: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginVertical: 16,
  },
  commentsSection: {
    marginTop: 16,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  commentThread: {
    marginBottom: 16,
  },
  comment: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 11,
    color: '#999999',
    fontStyle: 'italic',
  },
  createdAtText: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
    marginTop: 16,
  },
  attachButton: {
    backgroundColor: '#FDB316',
    paddingHorizontal: 25,
    paddingVertical: 6,
    borderRadius: 16,
  },
  attachButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  commentInputFrame: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  commentInputPlaceholder: {
    color: '#999999',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  modalCommentInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FDB316',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
  },
})

