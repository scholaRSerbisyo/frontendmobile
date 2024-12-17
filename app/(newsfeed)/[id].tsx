import React, { useState, useEffect, useCallback } from 'react'
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Modal, SafeAreaView, FlatList, Alert } from 'react-native'
import { Text } from '~/components/ui/text'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ChevronLeft, MessageCircle, X, Send, Trash2 } from 'lucide-react-native'
import { getImageUrl } from '~/components/services/imageService'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import API_URL from '~/constants/constants'
import { format, parseISO, formatDistanceToNow, isWithinInterval, parse, set, startOfDay, isSameDay } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { fetchComments, postComment, postReply, fetchReplies, deleteComment, deleteReply } from './api'
import { Comment, Reply, Event, Scholar } from './types'

export default function ContentScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [replyText, setReplyText] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [replies, setReplies] = useState<{ [commentId: number]: Reply[] }>({})
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false)
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false)
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null)
  const [hasExistingSubmission, setHasExistingSubmission] = useState(false)
  const [userRole, setUserRole] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [authenticatedScholarId, setAuthenticatedScholarId] = useState<number | null>(null)
  const [submissionTimeOut, setSubmissionTimeOut] = useState<string | null>(null)
  const [submissionTimeIn, setSubmissionTimeIn] = useState<string | null>(null) // Added state for submissionTimeIn


  useEffect(() => {
    fetchEvent()
    fetchEventComments()
    getUserRole()
    getAuthenticatedScholarId()
  }, [id])

  const getAuthenticatedScholarId = async () => {
    const scholarId = await SecureStore.getItemAsync('scholarId')
    setAuthenticatedScholarId(scholarId ? parseInt(scholarId) : null)
  }

  const getUserRole = async () => {
    const role = await SecureStore.getItemAsync('userRole')
    setUserRole(role ? parseInt(role) : null)
  }

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

  const fetchEventComments = useCallback(async () => {
    try {
      const result = await fetchComments(Number(id), currentPage)
      setComments(prevComments => [...prevComments, ...result.comments])
      setTotalPages(result.lastPage)
      result.comments.forEach(comment => fetchCommentReplies(comment.comment_id))
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }, [id, currentPage])

  const fetchCommentReplies = async (commentId: number) => {
    try {
      const result = await fetchReplies(commentId)
      setReplies(prevReplies => ({
        ...prevReplies,
        [commentId]: result
      }))
    } catch (error) {
      console.error('Error fetching replies:', error)
    }
  }

  const checkExistingSubmission = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      if (!token) throw new Error('No authentication token found')
      const response = await axios.get(`${API_URL}/events/check-submission/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setHasExistingSubmission(response.data.hasSubmission)
      setSubmissionTimeOut(response.data.timeOut)
      setSubmissionTimeIn(response.data.timeIn) //Added to set submissionTimeIn
    } catch (error) {
      console.error('Error checking existing submission:', error)
    }
  }

  const handleCommentSubmit = useCallback(async () => {
    if (commentText.trim() === '') {
      Alert.alert('Error', 'Comment text is required')
      return
    }

    try {
      setIsLoading(true)
      const newComment = await postComment(Number(id), commentText.trim())
      setComments(prevComments => [newComment, ...prevComments])
      setCommentText('')
      setIsCommentModalVisible(false)
    } catch (error) {
      console.error('Error posting comment:', error)
      if (error instanceof Error) {
        Alert.alert('Error', `Failed to post comment: ${error.message}`)
      } else {
        Alert.alert('Error', 'An unexpected error occurred while posting the comment')
      }
    } finally {
      setIsLoading(false)
    }
  }, [id, commentText])

  const handleReplySubmit = async () => {
    if (replyText.trim() === '' || selectedCommentId === null) return

    try {
      const newReply = await postReply(selectedCommentId, replyText.trim())
      setReplies(prevReplies => ({
        ...prevReplies,
        [selectedCommentId]: [...(prevReplies[selectedCommentId] || []), newReply]
      }))
      setReplyText('')
      setIsReplyModalVisible(false)
    } catch (error) {
      console.error('Error posting reply:', error)
      Alert.alert('Error', 'Failed to post reply. Please try again.')
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId)
      setComments(prevComments => prevComments.filter(comment => comment.comment_id !== commentId))
      delete replies[commentId]
    } catch (error) {
      console.error('Error deleting comment:', error)
      Alert.alert('Error', 'Failed to delete comment. Please try again.')
    }
  }

  const handleDeleteReply = async (commentId: number, replyId: number) => {
    try {
      await deleteReply(replyId)
      setReplies(prevReplies => ({
        ...prevReplies,
        [commentId]: prevReplies[commentId].filter(reply => reply.reply_id !== replyId)
      }))
    } catch (error) {
      console.error('Error deleting reply:', error)
      Alert.alert('Error', 'Failed to delete reply. Please try again.')
    }
  }

  const loadMoreComments = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  const formatDate = (dateString: string) => {
    const date = toZonedTime(parse(dateString, 'yyyy-MM-dd', new Date()), 'Asia/Manila')
    return format(date, 'MMMM d, yyyy')
  }

  const formatTime = (timeString: string) => {
    const timePart = timeString.split(' ')[1] || timeString
    const [hours, minutes] = timePart.split(':').map(Number)
    const time = toZonedTime(set(new Date(), { hours, minutes }), 'Asia/Manila')
    return format(time, 'h:mm a')
  }

  const getTimeSinceCreation = (createdAt: string) => {
    const date = toZonedTime(parseISO(createdAt), 'Asia/Manila')
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const isEventActive = (event: Event) => {
    const now = toZonedTime(new Date(), 'Asia/Manila')
    const eventDate = toZonedTime(parse(event.date, 'yyyy-MM-dd', new Date()), 'Asia/Manila')
    const timeFrom = event.time_from.split(' ')[1] || event.time_from
    const timeTo = event.time_to.split(' ')[1] || event.time_to
    const [fromHour, fromMinute] = timeFrom.split(':').map(Number)
    const [toHour, toMinute] = timeTo.split(':').map(Number)
    const eventStart = set(eventDate, { hours: fromHour, minutes: fromMinute })
    const eventEnd = set(eventDate, { hours: toHour, minutes: toMinute })
    return isWithinInterval(now, { start: eventStart, end: eventEnd })
  }

  const renderItem = ({ item: comment }: { item: Comment }) => (
    <View style={styles.commentThread}>
      <View style={styles.comment}>
        <Text style={styles.commentName}>{`${comment.scholar.firstname} ${comment.scholar.lastname}`}</Text>
        <Text style={styles.commentText}>{comment.comment_text}</Text>
        <Text style={styles.commentTime}>{getTimeSinceCreation(comment.created_at)}</Text>
      </View>
      {((userRole === 1 && comment.scholar_id === authenticatedScholarId) || userRole === 2) && replies[comment.comment_id]?.map((reply) => (
        <View key={`reply-${reply.reply_id}`} style={[styles.comment, styles.replyComment]}>
          <Text style={styles.commentName}>{`${reply.scholar.firstname} ${reply.scholar.lastname}`}</Text>
          <Text style={styles.commentText}>{reply.reply_text}</Text>
          <Text style={styles.commentTime}>{getTimeSinceCreation(reply.created_at)}</Text>
          {userRole === 2 && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteReply(comment.comment_id, reply.reply_id)}
            >
              <Trash2 size={16} color="#FF0000" />
            </TouchableOpacity>
          )}
        </View>
      ))}
      {((userRole === 1 && comment.scholar_id === authenticatedScholarId) || userRole === 2) && (
        <TouchableOpacity 
          style={styles.replyButton}
          onPress={() => {
            setSelectedCommentId(comment.comment_id);
            setIsReplyModalVisible(true);
          }}
        >
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>
      )}
      {userRole === 2 && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteComment(comment.comment_id)}
        >
          <Trash2 size={16} color="#FF0000" />
        </TouchableOpacity>
      )}
    </View>
  )

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
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => `comment-${item.comment_id}`}
        onEndReached={loadMoreComments}
        onEndReachedThreshold={0.1}
        extraData={replies}
        ListHeaderComponent={() => (
          <View style={styles.contentCard}>
            <View style={styles.content}>
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
            </View>

            <View style={styles.commentsSection}>
              <View style={styles.commentsHeader}>
                <Text style={styles.commentsTitle}>All comments</Text>
                {isEventActive(event) && (!hasExistingSubmission || (hasExistingSubmission && !submissionTimeOut)) && (
                  <TouchableOpacity 
                    style={styles.attachButton}
                    onPress={() => router.push(`/(proof)/submit-proof?id=${id}`)}
                  >
                    <Text style={styles.attachButtonText}>
                      {hasExistingSubmission && submissionTimeIn && !submissionTimeOut ? 'Attach File' : 'Attach File'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={styles.commentInputFrame}
                onPress={() => setIsCommentModalVisible(true)}
              >
                <Text style={styles.commentInputPlaceholder}>Write a comment...</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <Text style={styles.createdAtText}>
            Created {getTimeSinceCreation(event.created_at)}
          </Text>
        )}
      />
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isReplyModalVisible}
        onRequestClose={() => setIsReplyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Reply</Text>
              <TouchableOpacity onPress={() => setIsReplyModalVisible(false)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalCommentInput}
              multiline
              numberOfLines={4}
              placeholder="Write your reply here..."
              value={replyText}
              onChangeText={setReplyText}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleReplySubmit}>
              <Text style={styles.submitButtonText}>Post Reply</Text>
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
  content: {
    padding: 10,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    textAlign: 'center',
    paddingBottom: 20,
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
  replyButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  replyButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 12,
  },
  replyComment: {
    marginLeft: 20,
    backgroundColor: '#F8F8F8',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
})

