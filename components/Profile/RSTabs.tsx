import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Text } from '~/components/ui/text'

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
    flexDirection: 'row',
    backgroundColor: '#191851',
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FDB316',
  },
  tabText: {
    color: '#FFF',
    fontSize: 14,
  },
  activeTabText: {
    fontWeight: 'bold',
  },
})

