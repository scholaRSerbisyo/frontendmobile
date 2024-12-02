import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ChevronLeft, MoreVertical } from 'lucide-react-native'
import { Text } from '~/components/ui/text'
import { RSHeader } from '~/components/Profile/RSHeader'
import { RSTabs } from '~/components/Profile/RSTabs'
import { RSOverview } from '~/components/Profile/RSOverview'
import { RSVideos } from '~/components/Profile/RSVideos'
import { RSPhotos } from '~/components/Profile/RSPhotos'
import { RSSemesterView } from '~/components/Profile/RSSemesterView'
import { RSYearView } from '~/components/Profile/RSYearView'
import { ProfilePost } from '~/components/Profile/ProfilePost'

// Mock post data (simulating backend response)
const mockPost = {
  title: "Scholar's Cup",
  date: "02/14/2024",
  location: "Zone 2 Carmen Viamania",
  type: "CSO basis",
  description: "The gymnasium is hosting with excitement as students from nearby colleges gather for the CSO General Assembly!",
  images: [
    "https://example.com/scholars-cup-1.jpg",
    "https://example.com/scholars-cup-2.jpg"
  ]
};

export default function TotalRSScreen() {
  const [activeTab, setActiveTab] = useState('Post')
  const [view, setView] = useState<'semester' | 'year'>('semester')
  const router = useRouter()

  const renderContent = () => {
    switch (activeTab) {
      case 'Post':
        return <ProfilePost post={mockPost} />
      case 'Overview':
        return <RSOverview />
      case 'Videos':
        return <RSVideos />
      case 'Photos':
        return <RSPhotos />
      case 'Total RS':
        return (
          <>
            <View style={styles.viewToggle}>
              <TouchableOpacity 
                style={[
                  styles.toggleOption,
                  view === 'semester' && styles.activeToggle
                ]}
                onPress={() => setView('semester')}
              >
                <Text style={styles.toggleText}>By Semester</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.toggleOption,
                  view === 'year' && styles.activeToggle
                ]}
                onPress={() => setView('year')}
              >
                <Text style={styles.toggleText}>By Year</Text>
              </TouchableOpacity>
            </View>
            {view === 'semester' ? <RSSemesterView /> : <RSYearView />}
          </>
        )
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <RSHeader
        name="Shere Nacaitona"
        school="USTP Cagayan de Oro"
        location="Carmen"
        photo="https://i.pravatar.cc/300"
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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

