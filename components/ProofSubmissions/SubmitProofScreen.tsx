import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, TextInput, Platform, Image, Modal, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeft, Camera } from 'lucide-react-native'
import { Text } from '../ui/text'
import * as Location from 'expo-location'
import axios from 'axios'
import API_URL from '~/constants/constants'
import * as SecureStore from 'expo-secure-store'
import CameraScreen2 from '../Camera/TorchExample'
import { format } from 'date-fns'
import { CameraCapturedPicture } from 'expo-camera'

interface Event {
  event_id: number
  event_name: string
  date: string
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

  useEffect(() => {
    fetchEventDetails()
    fetchScholarInfo()
  }, [eventId])

  const fetchEventDetails = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.get<Event>(`${API_URL}/events/getevent/${eventId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setEvent(response.data)
    } catch (error) {
      console.error('Error fetching event details:', error)
    }
  }

  const fetchScholarInfo = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.get(`${API_URL}/user/scholar/me/show`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setSubmissionData(prev => ({ ...prev, scholar_id: response.data.scholar.scholar_id }))
    } catch (error) {
      console.error('Error fetching scholar info:', error)
    }
  }

  const handleImageCapture = (isTimeIn: boolean) => {
    setCurrentCaptureType(isTimeIn ? 'timeIn' : 'timeOut')
    setShowCamera(true)
  }

  const handleCameraClose = () => {
    setShowCamera(false)
    setCurrentCaptureType(null)
  }

  const handlePhotoConfirm = async (photo: CameraCapturedPicture & { exif?: { GPSLatitude?: number; GPSLongitude?: number } }) => {
    const base64Photo = `data:image/jpeg;base64,${photo.base64}`
    let locationString = 'Location not available'

    if (photo.exif?.GPSLatitude && photo.exif?.GPSLongitude) {
      try {
        const [address] = await Location.reverseGeocodeAsync({
          latitude: photo.exif.GPSLatitude,
          longitude: photo.exif.GPSLongitude
        })

        if (address) {
          const parts = [address.street, address.city, address.region, address.country].filter(Boolean)
          locationString = parts.join(', ')
        }
      } catch (error) {
        console.error('Error in reverse geocoding:', error)
      }
    }

    const currentTime = format(new Date(), 'HH:mm')

    if (currentCaptureType === 'timeIn') {
      setTimeInImage(base64Photo)
      setSubmissionData(prev => ({
        ...prev,
        time_in_image_uuid: generateUUID(),
        time_in_location: locationString,
        time_in_image: base64Photo,
        time_in: currentTime,
      }))
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

  const handleSubmit = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.post(`${API_URL}/events/submit`, submissionData, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log('Submission successful:', response.data)
      Alert.alert('Success', 'Proof submitted successfully')
      router.back()
    } catch (error) {
      console.error('Error submitting proof:', error)
      Alert.alert('Error', 'Failed to submit proof. Please try again.')
    }
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
          <Text style={styles.value}>{event.date}</Text>
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
          <TouchableOpacity 
            style={styles.photoButton} 
            onPress={() => handleImageCapture(true)}
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

          <TouchableOpacity 
            style={[styles.photoButton, !timeInImage && styles.disabledButton]}
            onPress={() => handleImageCapture(false)}
            disabled={!timeInImage}
          >
            {timeOutImage ? (
              <View style={styles.capturedImageContainer}>
                <Image source={{ uri: timeOutImage }} style={styles.capturedImage} />
                <Text style={styles.capturedLocationText}>{submissionData.time_out_location}</Text>
                <Text style={styles.capturedTimeText}>{submissionData.time_out}</Text>
              </View>
            ) : (
              <>
                <Camera size={32} color={timeInImage ? "#191851" : "#999"} />
                <Text style={[styles.photoButtonText, !timeInImage && styles.disabledText]}>Time out</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, (!timeInImage || !timeOutImage) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!timeInImage || !timeOutImage}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
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
})

