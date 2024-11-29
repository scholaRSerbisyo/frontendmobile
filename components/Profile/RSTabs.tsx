import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Text } from '../ui/text'

interface RSTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function RSTabs({ activeTab, onTabChange }: RSTabsProps) {
  const tabs = ['Post', 'Overview', 'Videos', 'Photos', 'Total RS']

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabChange(tab)}
          style={[
            styles.tab,
            activeTab === tab && styles.activeTab
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#191851',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FDB316',
  },
  tabText: {
    color: '#FFF',
    fontSize: 12,
  },
  activeTabText: {
    fontWeight: 'bold',
  },
})

