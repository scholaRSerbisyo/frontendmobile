import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RSHeader } from '~/components/Profile/RSHeader'
import { RSTabs } from '~/components/Profile/RSTabs'
import { RSSemesterView } from '~/components/Profile/RSSemesterView'
import { RSYearView } from '~/components/Profile/RSYearView'
import { Text } from '~/components/ui/text'

export default function TotalRSScreen() {
  const [activeTab, setActiveTab] = useState('Total RS')
  const [view, setView] = useState<'semester' | 'year'>('semester')

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
    padding: 8,
  },
  toggleOption: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: '#F5F5F5',
  },
  toggleText: {
    color: '#191851',
    fontSize: 14,
    fontWeight: '500',
  },
})

