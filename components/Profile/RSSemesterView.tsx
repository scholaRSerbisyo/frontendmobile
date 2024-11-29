import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Text } from '../ui/text'
import { RSListItem } from './RSListItem'

interface SemesterData {
  year: string
  semesters: {
    title: string
    status: 'Complete' | 'Incomplete'
    hours: string
  }[]
}

const semesterData: SemesterData[] = [
  {
    year: 'Year: 2023-2024',
    semesters: [
      { title: 'CSO base', status: 'Incomplete', hours: '2/5' },
      { title: '2nd Sem', status: 'Complete', hours: '7/5' },
    ]
  },
  {
    year: 'Year: 2022-2023',
    semesters: [
      { title: '1st Sem', status: 'Complete', hours: '5/5' },
      { title: '2nd Sem', status: 'Complete', hours: '5/5' },
    ]
  },
  {
    year: 'Year: 2021-2022',
    semesters: [
      { title: '1st Sem', status: 'Complete', hours: '7/5' },
      { title: '2nd Sem', status: 'Complete', hours: '10/5' },
    ]
  },
  {
    year: 'Year: 2020-2021',
    semesters: [
      { title: '1st Sem', status: 'Complete', hours: '6/5' },
      { title: '2nd Sem', status: 'Complete', hours: '8/5' },
    ]
  },
  {
    year: 'Year: 2019-2020',
    semesters: [
      { title: '1st Sem', status: 'Complete', hours: '5/5' },
      { title: '2nd Sem', status: 'Complete', hours: '5/5' },
    ]
  }
]

export function RSSemesterView() {
  return (
    <ScrollView style={styles.container}>
      {semesterData.map((yearData, index) => (
        <View key={index} style={styles.yearSection}>
          <Text style={styles.yearTitle}>{yearData.year}</Text>
          {yearData.semesters.map((semester, semIndex) => (
            <RSListItem
              key={semIndex}
              title={semester.title}
              status={semester.status}
              hours={semester.hours}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  yearSection: {
    marginBottom: 8,
  },
  yearTitle: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
})

