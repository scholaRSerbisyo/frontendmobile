import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, ActivityIndicator, View } from 'react-native'
import { RSListItem } from './RSListItem'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import API_URL from '~/constants/constants'
import { Text } from '../ui/text'

interface YearlyReturnService {
  year: number
  count: number
}

interface ReturnService {
  yearlyReturnServices: YearlyReturnService[]
}

export function RSYearView() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [returnService, setReturnService] = useState<ReturnService | null>(null)

  useEffect(() => {
    fetchReturnServiceCount()
  }, [])

  const fetchReturnServiceCount = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      const scholarId = await SecureStore.getItemAsync('scholarId')
      
      const response = await axios.get<{ scholar: ReturnService }>(
        `${API_URL}/events/scholars/${scholarId}/return-service-count`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      setReturnService(response.data.scholar)
    } catch (err) {
      console.error('Error fetching return service count:', err)
      setError('Failed to load return service data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FDB316" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  if (!returnService?.yearlyReturnServices || returnService.yearlyReturnServices.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noDataText}>No Return Service found</Text>
      </View>
    )
  }

  // Group by year and create semester entries
  const years = returnService.yearlyReturnServices.reduce((acc, service) => {
    if (!acc[service.year]) {
      acc[service.year] = {
        firstSem: { count: 0, status: 'Incomplete' as const },
        secondSem: { count: 0, status: 'Incomplete' as const }
      }
    }
    
    // For this example, we'll split the count between semesters
    // You should adjust this logic based on your actual data structure
    const semesterCount = Math.floor(service.count / 2)
    acc[service.year].firstSem = {
      count: semesterCount,
      status: semesterCount >= 5 ? 'Complete' : 'Incomplete'
    }
    acc[service.year].secondSem = {
      count: service.count - semesterCount,
      status: (service.count - semesterCount) >= 5 ? 'Complete' : 'Incomplete'
    }
    
    return acc
  }, {} as Record<number, { firstSem: { count: number, status: 'Complete' | 'Incomplete' }, secondSem: { count: number, status: 'Complete' | 'Incomplete' } }>)

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerText, styles.yearHeader]}>Year</Text>
          <Text style={[styles.headerText, styles.statusHeader]}>Status</Text>
          <Text style={[styles.headerText, styles.rsHeader]}>Recorded RS</Text>
        </View>
      </View>
      {Object.entries(years)
        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
        .map(([year, data]) => (
          <View key={year}>
            <Text style={styles.yearText}>{year}</Text>
            <RSListItem
              title="1st Sem"
              status={data.firstSem.status}
              hours={`${data.firstSem.count}/5`}
            />
            <RSListItem
              title="2nd Sem"
              status={data.secondSem.status}
              hours={`${data.secondSem.count}/5`}
            />
          </View>
        ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    minHeight: 200,
  },
  headerContainer: {
    // marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  headerText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  yearHeader: {
    flex: 1,
  },
  statusHeader: {
    flex: 1,
    textAlign: 'center',
  },
  rsHeader: {
    flex: 1,
    textAlign: 'right',
  },
  yearText: {
    fontSize: 14,
    color: 'black',
    marginBottom: 8,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
  },
  noDataText: {
    color: '#343474',
    fontSize: 18,
    textAlign: 'center',
  },
})

