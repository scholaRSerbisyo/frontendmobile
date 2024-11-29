import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { RSListItem } from './RSListItem'

const yearData = [
  { title: '2024', status: 'Incomplete' as const, hours: '2/5' },
  { title: '2023', status: 'Complete' as const, hours: '7/5' },
  { title: '2022', status: 'Complete' as const, hours: '2/5' },
  { title: '2021', status: 'Complete' as const, hours: '7/5' },
  { title: '2020', status: 'Complete' as const, hours: '2/5' },
  { title: '2019', status: 'Complete' as const, hours: '7/5' },
]

export function RSYearView() {
  return (
    <ScrollView style={styles.container}>
      {yearData.map((year, index) => (
        <RSListItem
          key={index}
          title={year.title}
          status={year.status}
          hours={year.hours}
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
})

