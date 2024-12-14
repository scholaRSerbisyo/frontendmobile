import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, TextInput, Image, Modal, Alert, ScrollView, StatusBar } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeft, Camera } from 'lucide-react-native'
import { Text } from '../ui/text'
import * as SecureStore from 'expo-secure-store'
import CameraScreen2 from '../Camera/TorchExample'
import { format, parse, isWithinInterval, set, startOfDay, isSameDay } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Toast } from '../ui/toast'
import { CameraCapturedPicture } from 'expo-camera'
import * as Location from 'expo-location';
import axios from 'axios';
import API_URL from '~/constants/constants'

interface Event {
  event_id: number
  event_name: string
  date: string
  time_from: string
  time_to: string
  location: string
  event_type: {
    name: string
  }
  description: string
}

interface SubmissionData {
  event_id: number
  scholar_id: number
  time_in_image_uuid: string
  time_in_location: string
  time_in_image: string
  time_out_image_uuid: string
  time_out_location: string
  time_out_image: string
  time_in: string
  time_out: string
  description: string
}

interface SubmitProofScreenProps {
  eventId: string
}

export function SubmitProofScreen({ eventId }: SubmitProofScreenProps) {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [submissionData, setSubmissionData] = useState<SubmissionData>({
    event_id: Number(eventId),
    scholar_id: 0,
    time_in_image_uuid: '',
    time_in_location: '',
    time_in_image: '',
    time_out_image_uuid: '',
    time_out_location: '',
    time_out_image: '',
    time_in: '',
    time_out: '',
    description: '',
  })
  const [timeInImage, setTimeInImage] = useState<string | null>(null)
  const [timeOutImage, setTimeOutImage] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [currentCaptureType, setCurrentCaptureType] = useState<'timeIn' | 'timeOut' | null>(null)
  const [submissionId, setSubmissionId] = useState<number | null>(null)
  const [isTimeInSubmitted, setIsTimeInSubmitted] = useState(false)
  const [hasExistingSubmission, setHasExistingSubmission] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isEventActive, setIsEventActive] = useState(false)

  useEffect(() => {
    fetchEventDetails()
    fetchScholarInfo()
    checkExistingSubmission()
  }, [eventId])

  useEffect(() => {
    if (event) {
      checkEventActive()
    }
  }, [event])

  const fetchEventDetails = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.get<Event>(`${API_URL}/events/getevent/${eventId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      setEvent(response.data)
    } catch (error) {
      console.error('Error fetching event details:', error)
      Alert.alert('Error', 'Failed to fetch event details. Please try again.')
    }
  }

  const fetchScholarInfo = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.get(`${API_URL}/user/scholar/me/show`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      setSubmissionData(prev => ({ ...prev, scholar_id: response.data.scholar.scholar_id }))
    } catch (error) {
      console.error('Error fetching scholar info:', error)
      Alert.alert('Error', 'Failed to fetch scholar information. Please try again.')
    }
  }

  const checkExistingSubmission = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.get(`${API_URL}/events/check-submission/${eventId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      setHasExistingSubmission(response.data.hasSubmission)
      if (response.data.hasSubmission) {
        setIsTimeInSubmitted(true)
        setSubmissionId(response.data.submissionId)
      }
    } catch (error) {
      console.error('Error checking existing submission:', error)
    }
  }

  const checkEventActive = () => {
    if (!event) return

    const now = toZonedTime(new Date(), 'Asia/Manila')
    const eventDate = toZonedTime(parse(event.date, 'yyyy-MM-dd', new Date()), 'Asia/Manila')

    const timeFrom = event.time_from.split(' ')[1] || event.time_from
    const timeTo = event.time_to.split(' ')[1] || event.time_to

    const [fromHour, fromMinute] = timeFrom.split(':').map(Number)
    const [toHour, toMinute] = timeTo.split(':').map(Number)

    const eventTimeFrom = set(eventDate, { hours: fromHour, minutes: fromMinute })
    const eventTimeTo = set(eventDate, { hours: toHour, minutes: toMinute })

    if (eventDate >= startOfDay(now)) {
      if (isSameDay(eventDate, now)) {
        setIsEventActive(isWithinInterval(now, { start: eventTimeFrom, end: eventTimeTo }))
      } else {
        setIsEventActive(true)
      }
    } else {
      setIsEventActive(false)
    }
  }

  const handleImageCapture = async (isTimeIn: boolean) => {
    if (hasExistingSubmission && isTimeIn) {
      setErrorMessage('You have already submitted proof for this event.')
      setShowErrorToast(true)
      return
    }
    if (!isEventActive) {
      setErrorMessage('You can only submit proof during the event time.')
      setShowErrorToast(true)
      return
    }
    setCurrentCaptureType(isTimeIn ? 'timeIn' : 'timeOut')
    setShowCamera(true)
  }

  const handleCameraClose = () => {
    setShowCamera(false)
    setCurrentCaptureType(null)
  }

  const handlePhotoConfirm = async (photo: CameraCapturedPicture & { location?: { latitude: number; longitude: number } }) => {
    const base64Photo = `data:image/jpeg;base64,${photo.base64}`
    let locationString = 'Location not available'

    if (photo.exif?.GPSLatitude && photo.exif?.GPSLongitude) {
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            format: 'json',
            lat: photo.exif.GPSLatitude,
            lon: photo.exif.GPSLongitude,
          },
          headers: {
            'User-Agent': 'ScholarSerbisyoApp/1.0',
          },
        });

        if (response.data && response.data.display_name) {
          locationString = response.data.display_name;
        } else {
          console.warn('Detailed address not available from Nominatim API');
          locationString = `Latitude: ${photo.exif.GPSLatitude}, Longitude: ${photo.exif.GPSLongitude}`;
        }
      } catch (error) {
        console.error('Error in reverse geocoding:', error);
        locationString = `Latitude: ${photo.exif.GPSLatitude}, Longitude: ${photo.exif.GPSLongitude}`;
      }
    } else if (photo.location) {
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            format: 'json',
            lat: photo.location.latitude,
            lon: photo.location.longitude,
          },
          headers: {
            'User-Agent': 'ScholarSerbisyoApp/1.0',
          },
        });

        if (response.data && response.data.display_name) {
          locationString = response.data.display_name;
        } else {
          console.warn('Detailed address not available from Nominatim API');
          locationString = `Latitude: ${photo.location.latitude}, Longitude: ${photo.location.longitude}`;
        }
      } catch (error) {
        console.error('Error in reverse geocoding:', error);
        locationString = `Latitude: ${photo.location.latitude}, Longitude: ${photo.location.longitude}`;
      }
    } else {
      console.warn('No location data available');
    }

    const currentTime = format(toZonedTime(new Date(), 'Asia/Manila'), 'H:mm')

    if (currentCaptureType === 'timeIn') {
      setTimeInImage(base64Photo)
      const newSubmissionData = {
        ...submissionData,
        time_in_image_uuid: generateUUID(),
        time_in_location: locationString,
        time_in_image: base64Photo,
        time_in: currentTime,
      }
      setSubmissionData(newSubmissionData)
      await saveTimeInSubmission(newSubmissionData)
    } else if (currentCaptureType === 'timeOut') {
      setTimeOutImage(base64Photo)
      setSubmissionData(prev => ({
        ...prev,
        time_out_image_uuid: generateUUID(),
        time_out_location: locationString,
        time_out_image: base64Photo,
        time_out: currentTime,
      }))
    }
    setShowCamera(false)
    setCurrentCaptureType(null)
  }

  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const saveTimeInSubmission = async (data: SubmissionData) => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.post(`${API_URL}/events/submit-time-in`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      console.log('Time In submission successful:', response.data)
      setSubmissionId(response.data.submission_id)
      setIsTimeInSubmitted(true)
      Alert.alert('Success', 'Time In recorded successfully')
    } catch (error: any) {
      console.error('Error submitting Time In:', error)
      Alert.alert('Error', `Failed to record Time In. ${error.response?.data?.message || error.message || 'Please try again.'}`)
    }
  }

  const handleSubmit = async () => {
    if (!isTimeInSubmitted) {
      try {
        await saveTimeInSubmission(submissionData)
      } catch (error) {
        console.error('Error saving Time In:', error)
        return
      }
    }

    if (!timeOutImage) {
      Alert.alert('Incomplete Submission', 'Please capture the Time Out image to complete your submission.')
      return
    }

    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.post(`${API_URL}/events/submit-time-out`, {
        submission_id: submissionId,
        ...submissionData
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      console.log('Time Out submission successful:', response.data)
      Alert.alert('Success', 'Proof submitted successfully')
      router.back()
    } catch (error: any) {
      console.error('Error submitting proof:', error)
      Alert.alert('Error', `Failed to submit proof. ${error.response?.data?.message || error.message || 'Please try again.'}`)
    }
  }

  const formatDate = (dateString: string) => {
    const date = parse(dateString, 'yyyy-MM-dd', new Date())
    return format(date, 'MMMM d, yyyy')
  }

  const formatTime = (timeString: string) => {
    const time = parse(timeString, 'HH:mm:ss', new Date())
    return format(time, 'h:mm a')
  }

  const formatTimeForDisplay = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    return `${hours.padStart(2, '0')}:${minutes}`
  }

  if (!event) {
    return <Text>Loading...</Text>
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.orangeBar} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submit</Text>
        <TouchableOpacity>
          <Text style={styles.profileLink}>Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <Text style={styles.eventTitle}>{event.event_name}</Text>

          <View style={styles.formField}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{formatDate(event.date)}</Text>
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{event.location}</Text>
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Type of Event: <Text style={styles.value}>{event.event_type.name}</Text></Text>
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              value={submissionData.description}
              onChangeText={(text) => setSubmissionData(prev => ({ ...prev, description: text }))}
              placeholder="Type here..."
              placeholderTextColor="#A0A0A0"
            />
          </View>

          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Time In</Text>
            <TouchableOpacity 
              style={styles.photoButton} 
              onPress={() => handleImageCapture(true)}
              disabled={isTimeInSubmitted}
            >
              {timeInImage ? (
                <Image source={{ uri: timeInImage }} style={styles.capturedImage} />
              ) : (
                <Camera size={32} color="#F3BC00" />
              )}
            </TouchableOpacity>

            <Text style={styles.photoLabel}>Time Out</Text>
            <TouchableOpacity 
              style={[styles.photoButton, !isTimeInSubmitted && styles.disabledButton]}
              onPress={() => handleImageCapture(false)}
              disabled={!isTimeInSubmitted || !!timeOutImage}
            >
              {timeOutImage ? (
                <Image source={{ uri: timeOutImage }} style={styles.capturedImage} />
              ) : (
                <Camera size={32} color={isTimeInSubmitted ? "#1E1B4B" : "#999"} />
              )}
            </TouchableOpacity>
          </View>

          {!isEventActive && (
            <Text style={styles.eventInactiveText}>
              Proof submission is only available during the event time.
            </Text>
          )}

          <TouchableOpacity 
            style={[styles.submitButton, (!isTimeInSubmitted || !timeOutImage || !isEventActive) && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!isTimeInSubmitted || !timeOutImage || !isEventActive}
          >
            <Text style={styles.submitButtonText}>
              {isTimeInSubmitted ? 'Submit' : 'Save Time In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showCamera}
        onRequestClose={handleCameraClose}
      >
        <CameraScreen2
          navigation={{
            goBack: handleCameraClose,
          }}
          onPhotoConfirm={handlePhotoConfirm}
        />
      </Modal>

      <Toast
        visible={showErrorToast}
        message={errorMessage}
        onDismiss={() => setShowErrorToast(false)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  orangeBar: {
    height: 4,
    backgroundColor: '#F3BC00',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    zIndex: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E1B4B',
    paddingTop: 16
  },
  profileLink: {
    fontSize: 16,
    color: '#4F46E5',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E1B4B',
    marginBottom: 24,
  },
  formField: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#1E1B4B',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#1E1B4B',
    fontWeight: '400',
  },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1E1B4B',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    minHeight: 120,
  },
  photoSection: {
    marginTop: 24,
  },
  photoLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1B4B',
    marginBottom: 12,
  },
  photoButton: {
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 24,
    overflow: 'hidden',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButton: {
    backgroundColor: '#F3BC00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#1E1B4B',
    fontSize: 18,
    fontWeight: '600',
  },
  eventInactiveText: {
    color: '#FF0000',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
})

export default SubmitProofScreen

