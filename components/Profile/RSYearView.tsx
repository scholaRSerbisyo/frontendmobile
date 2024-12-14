import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, ActivityIndicator, View } from 'react-native'
import { RSListItem } from './RSListItem'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import API_URL from '~/constants/constants'
import { Text } from '../ui/text'

interface YearlyReturnService {
  year: number;
  count: number;
}

interface ReturnService {
  id: number;
  firstname: string;
  lastname: string;
  mobilenumber: string;
  age: number;
  yearLevel: string;
  scholarType: string;
  school: {
    name: string;
  };
  barangay: {
    name: string;
  };
  yearlyReturnServices: YearlyReturnService[];
}

interface YearData {
  title: string;
  status: 'Complete' | 'Incomplete';
  hours: string;
}

export function RSYearView() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [returnService, setReturnService] = useState<ReturnService | null>(null)
  const [yearData, setYearData] = useState<YearData[]>([])

  useEffect(() => {
    fetchReturnServiceCount()
  }, [])

  useEffect(() => {
    if (returnService) {
      updateYearData()
    }
  }, [returnService])

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

  const updateYearData = () => {
    if (returnService && returnService.yearlyReturnServices) {
      const newYearData: YearData[] = returnService.yearlyReturnServices.map(yearService => ({
        title: yearService.year.toString(),
        status: yearService.count >= 5 ? 'Complete' : 'Incomplete',
        hours: `${yearService.count}/5`
      }));
      setYearData(newYearData);
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
    paddingTop: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
  },
})

