import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeft, Sun, Moon, Camera } from 'lucide-react-native'
import { Text } from '../ui/text'
import * as Location from 'expo-location'

interface ProofSubmission {
  eventName: string
  date: string
  location: string
  eventType: string
  description: string
  timeInPhoto?: string
  timeOutPhoto?: string
}

export function SubmitProofScreen() {
  const router = useRouter()
  const [currentLocation, setCurrentLocation] = useState<string>('')
  const [proofData, setProofData] = useState<ProofSubmission>({
    eventName: "Scholar's Cup", // This would come from the selected event
    date: new Date().toLocaleDateString(),
    location: '',
    eventType: 'CSO Event', // This would come from the selected event type
    description: '',
  })

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.warn('Location permission not granted')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })

      if (address[0]) {
        const { street, subregion, city, region } = address[0]
        const locationParts = [
          street,
          subregion, // This is often the barangay in the Philippines
          city,
          region // This is often the province in the Philippines
        ].filter(Boolean) // Remove any undefined or empty strings

        const locationString = locationParts.join(', ')

        setCurrentLocation(locationString)
        setProofData(prev => ({ ...prev, location: locationString }))
      } else {
        console.warn('Unable to determine location')
        setCurrentLocation('Location not available')
        setProofData(prev => ({ ...prev, location: 'Location not available' }))
      }
    })()
  }, [])

  const handleTimeInPhoto = () => {
    router.push('/camera')
  }

  const handleTimeOutPhoto = () => {
    router.push('/camera')
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log('Submitting proof:', proofData)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submit</Text>
        <Text style={styles.profileText}>Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.formField}>
          <Text style={styles.label}>{proofData.eventName}</Text>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{proofData.date}</Text>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{currentLocation || 'Detecting location...'}</Text>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Type of Event</Text>
          <Text style={styles.value}>{proofData.eventType}</Text>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            value={proofData.description}
            onChangeText={(text) => setProofData(prev => ({ ...prev, description: text }))}
            placeholder="Enter description"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.photoSection}>
          <TouchableOpacity 
            style={styles.photoButton} 
            onPress={handleTimeInPhoto}
          >
            <Camera size={32} color="#FDB316" />
            <Text style={styles.photoButtonText}>Time in</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.photoButton}
            onPress={handleTimeOutPhoto}
          >
            <Camera size={32} color="#191851" />
            <Text style={styles.photoButtonText}>Time out</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#191851',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileText: {
    fontSize: 16,
    color: '#FFFFFF',
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
})

