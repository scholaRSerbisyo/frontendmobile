import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Text } from '~/components/ui/text'
import { RSHeader } from '~/components/Profile/RSHeader'
import { RSTabs } from '~/components/Profile/RSTabs'
import { RSOverview } from '~/components/Profile/RSOverview'
import { RSVideos } from '~/components/Profile/RSVideos'
import { RSPhotos } from '~/components/Profile/RSPhotos'
import { RSSemesterView } from '~/components/Profile/RSSemesterView'
import { RSYearView } from '~/components/Profile/RSYearView'
import { ProfilePost } from '~/components/Profile/ProfilePost'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import API_URL from '~/constants/constants'

interface Submission {
  submission_id: number;
  event: {
    event_id: number;
    event_name: string;
    description: string;
    date: string;
    time_from: string;
    time_to: string;
    location: string;
    status: string;
    event_type: string;
    school: string | null;
    barangay: string | null;
  };
  submission_details: {
    time_in: string;
    time_out: string;
    time_in_location: string;
    time_out_location: string;
    time_in_image_uuid: string;
    time_out_image_uuid: string;
  };
}

interface PhotoData {
  image_uuid: string;
  event_name: string;
}

interface ScholarData {
  user_id: number;
  email: string;
  email_verified_at: string | null;
  role_id: number;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  scholar: {
    scholar_id: number;
    firstname: string;
    lastname: string;
    age: number;
    address: string;
    mobilenumber: string;
    yearlevel: string;
    scholar_type_id: number;
    user_id: number;
    school_id: number;
    baranggay_id: number;
    created_at: string;
    updated_at: string;
  };
}

export default function TotalRSScreen() {
  const [activeTab, setActiveTab] = useState('Post')
  const [view, setView] = useState<'semester' | 'year'>('semester')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scholarData, setScholarData] = useState<ScholarData | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchScholarData()
    fetchSubmissions()
    fetchPhotos()
  }, [])

  const fetchScholarData = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.get<ScholarData>(`${API_URL}/user/scholar/me/show`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setScholarData(response.data)
    } catch (err) {
      console.error('Error fetching scholar data:', err)
      setError('Failed to load scholar data')
    }
  }

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.get<Submission[]>(`${API_URL}/events/scholar/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setSubmissions(response.data)
    } catch (err) {
      console.error('Error fetching submissions:', err)
      setError('Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  const fetchPhotos = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const response = await axios.get<{ data: { submission_id: number, event_id: number, event_name: string, time_in_image_uuid: string, time_out_image_uuid: string }[] }>(`${API_URL}/events/scholar/submission-images`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const photoData: PhotoData[] = response.data.data.flatMap(item => [
        { image_uuid: item.time_in_image_uuid, event_name: item.event_name },
        { image_uuid: item.time_out_image_uuid, event_name: item.event_name }
      ]).filter(photo => photo.image_uuid)
      setPhotos(photoData)
    } catch (err) {
      console.error('Error fetching photos:', err)
      setError('Failed to load photos')
    }
  }

  const renderContent = () => {
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

    switch (activeTab) {
      case 'Post':
        return (
          <ScrollView style={styles.scrollView}>
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <ProfilePost key={submission.submission_id} submission={submission} />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No submissions found</Text>
              </View>
            )}
          </ScrollView>
        )
      case 'Overview':
        return <RSOverview />
      case 'Photos':
        return <RSPhotos photos={photos} />
      case 'Total RS':
        return (
          <>
            <View style={styles.viewToggle}>
              <Text style={{color: 'black'}}>Year</Text>
            </View>
            <RSYearView />
          </>
        )
      default:
        return null
    }
  }

  const getFullName = (scholar: ScholarData['scholar']) => {
    return `${scholar.firstname} ${scholar.lastname}`.trim();
  }

  return (
    <SafeAreaView style={styles.container}>
      <RSHeader
        name={scholarData ? getFullName(scholarData.scholar) : ""}
        school="School Name" // Note: School name is not provided in the sample data
        location="Location" // Note: Location is not provided in the sample data
        photo="https://i.pravatar.cc/300" // Note: Profile photo is not provided in the sample data
      />
      <RSTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {renderContent()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191851',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 0,
  },
  toggleOption: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeToggle: {
    borderBottomColor: '#FDB316',
    backgroundColor: '#FFF',
  },
  toggleText: {
    color: '#191851',
    fontSize: 16,
    fontWeight: '600',
  },
})

