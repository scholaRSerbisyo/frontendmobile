import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, TextInput, Image, Modal, Alert } from 'react-native'
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
      const response = await fetch(`${API_URL}/events/getevent/${eventId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const data = await response.json()
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event details:', error)
      Alert.alert('Error', 'Failed to fetch event details. Please try again.')
    }
  }

  const fetchScholarInfo = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await fetch(`${API_URL}/user/scholar/me/show`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const data = await response.json()
      setSubmissionData(prev => ({ ...prev, scholar_id: data.scholar.scholar_id }))
    } catch (error) {
      console.error('Error fetching scholar info:', error)
      Alert.alert('Error', 'Failed to fetch scholar information. Please try again.')
    }
  }

  const checkExistingSubmission = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await fetch(`${API_URL}/events/check-submission/${eventId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const data = await response.json()
      setHasExistingSubmission(data.hasSubmission)
      if (data.hasSubmission) {
        setIsTimeInSubmitted(true)
        setSubmissionId(data.submissionId)
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

    const currentTime = format(toZonedTime(new Date(), 'Asia/Manila'), 'HH:mm:ss')

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
      const response = await fetch(`${API_URL}/events/submit-time-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      
      const responseText = await response.text()
      let resData
      try {
        resData = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Error parsing response:', responseText)
        throw new Error('Server returned an invalid response')
      }

      if (!response.ok) {
        throw new Error(resData.message || 'Server returned an error')
      }

      console.log('Time In submission successful:', resData)
      setSubmissionId(resData.submission_id)
      setIsTimeInSubmitted(true)
      Alert.alert('Success', 'Time In recorded successfully')
    } catch (error: any) {
      console.error('Error submitting Time In:', error)
      Alert.alert('Error', `Failed to record Time In. ${error.message || 'Please try again.'}`)
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
      const response = await fetch(`${API_URL}/events/submit-time-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          submission_id: submissionId,
          ...submissionData
        }),
      })

      const responseText = await response.text()
      let resData
      try {
        resData = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Error parsing response:', responseText)
        throw new Error('Server returned an invalid response')
      }

      if (!response.ok) {
        throw new Error(resData.message || 'Server returned an error')
      }

      console.log('Time Out submission successful:', resData)
      Alert.alert('Success', 'Proof submitted successfully')
      router.back()
    } catch (error: any) {
      console.error('Error submitting proof:', error)
      Alert.alert('Error', `Failed to submit proof. ${error.message || 'Please try again.'}`)
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

  if (!event) {
    return <Text>Loading...</Text>
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submit Proof</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.formField}>
          <Text style={styles.label}>{event.event_name}</Text>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{formatDate(event.date)}</Text>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Event Location</Text>
          <Text style={styles.value}>{event.location}</Text>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Type of Event</Text>
          <Text style={styles.value}>{event.event_type.name}</Text>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            value={submissionData.description}
            onChangeText={(text) => setSubmissionData(prev => ({ ...prev, description: text }))}
            placeholder="Enter description"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.photoSection}>
          {isEventActive && !hasExistingSubmission && (
            <TouchableOpacity 
              style={styles.photoButton} 
              onPress={() => handleImageCapture(true)}
              disabled={isTimeInSubmitted}
            >
              {timeInImage ? (
                <View style={styles.capturedImageContainer}>
                  <Image source={{ uri: timeInImage }} style={styles.capturedImage} />
                  <Text style={styles.capturedLocationText}>{submissionData.time_in_location}</Text>
                  <Text style={styles.capturedTimeText}>{submissionData.time_in}</Text>
                </View>
              ) : (
                <>
                  <Camera size={32} color="#FDB316" />
                  <Text style={styles.photoButtonText}>Time in</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {isEventActive && (
            <TouchableOpacity 
              style={[styles.photoButton, !isTimeInSubmitted && styles.disabledButton]}
              onPress={() => handleImageCapture(false)}
              disabled={!isTimeInSubmitted || !!timeOutImage}
            >
              {timeOutImage ? (
                <View style={styles.capturedImageContainer}>
                  <Image source={{ uri: timeOutImage }} style={styles.capturedImage} />
                  <Text style={styles.capturedLocationText}>{submissionData.time_out_location}</Text>
                  <Text style={styles.capturedTimeText}>{submissionData.time_out}</Text>
                </View>
              ) : (
                <>
                  <Camera size={32} color={isTimeInSubmitted ? "#191851" : "#999"} />
                  <Text style={[styles.photoButtonText, !isTimeInSubmitted && styles.disabledText]}>Time out</Text>
                </>
              )}
            </TouchableOpacity>
          )}
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#191851',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 8,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#191851',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#191851',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  photoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  photoButton: {
    flex: 1,
    marginHorizontal: 8,
    height: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  photoButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: '#191851',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  capturedImageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  capturedLocationText: {
    position: 'absolute',
    bottom: 20,
    left: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: 2,
    fontSize: 10,
    textAlign: 'center',
    borderRadius: 4,
  },
  capturedTimeText: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: 2,
    fontSize: 10,
    textAlign: 'center',
    borderRadius: 4,
  },
  submitButton: {
    backgroundColor: '#FDB316',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#191851',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#E5E5E5',
  },
  disabledText: {
    color: '#999',
  },
  eventInactiveText: {
    color: '#FF0000',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
})

export default SubmitProofScreen

