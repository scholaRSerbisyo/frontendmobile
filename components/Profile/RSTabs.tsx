import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Text } from '../ui/text'

interface RSTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function RSTabs({ activeTab, onTabChange }: RSTabsProps) {
  const tabs = ['Post', 'Overview', 'Photos', 'Total RS']

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
          {activeTab === tab && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      ))}
      <View style={styles.divider} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    position: 'relative',
  },
  activeTab: {
    // Remove borderBottomWidth and borderBottomColor from here
  },
  tabText: {
    color: '#343474',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#F3BC00',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#F3BC00',
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    // backgroundColor: 'rgba(253, 179, 22, 0.8)', // #F3BC00 with 80% opacity
  },
})

