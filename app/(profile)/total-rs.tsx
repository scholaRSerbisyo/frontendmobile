import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RSHeader } from '~/components/Profile/RSHeader'
import { RSTabs } from '~/components/Profile/RSTabs'
import { RSOverview } from '~/components/Profile/RSOverview'
import { RSVideos } from '~/components/Profile/RSVideos'
import { RSPhotos } from '~/components/Profile/RSPhotos'
import { RSSemesterView } from '~/components/Profile/RSSemesterView'
import { RSYearView } from '~/components/Profile/RSYearView'
import { Text } from '~/components/ui/text'

export default function TotalRSScreen() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [view, setView] = useState<'semester' | 'year'>('semester')

  const renderContent = () => {
    switch (activeTab) {
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
              <View 
                style={[
                  styles.toggleOption,
                  view === 'semester' && styles.activeToggle
                ]}
                onTouchEnd={() => setView('semester')}
              >
                <Text style={styles.toggleText}>By Semester</Text>
              </View>
              <View 
                style={[
                  styles.toggleOption,
                  view === 'year' && styles.activeToggle
                ]}
                onTouchEnd={() => setView('year')}
              >
                <Text style={styles.toggleText}>By Year</Text>
              </View>
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

