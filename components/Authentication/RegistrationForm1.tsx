import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native'
import { Link, useRouter } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Text } from '../ui/text'
import { Input } from '../ui/input'
import axios from 'axios'
import API_URL from '~/constants/constants'

export function RegistrationForm1() {
  const router = useRouter()
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [scholarId, setScholarId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleValidation = async () => {
    if (!lastName || !firstName) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(`${API_URL}/user/validate-scholar`, {
        lastname: lastName,
        firstname: firstName,
        scholar_id: scholarId
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (response.data.exists) {
        // Scholar found, proceed to next step
        router.push({
          pathname: '/(authentication)/registeruserpass',
          params: { scholarId: response.data.scholar_id }
        })
      } else {
        Alert.alert('Not Found', 'No unlinked scholar found with the given information.')
      }
    } catch (error) {
      console.log('Validation error:', error)
      Alert.alert('Error', 'Failed to validate scholar. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Registration</Text>

      <Input
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <Input
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <Input
        placeholder="Scholar ID"
        value={scholarId}
        onChangeText={setScholarId}
        style={styles.input}
      />

      <TouchableOpacity 
        style={[styles.continueButton, isLoading && styles.disabledButton]}
        onPress={handleValidation}
        disabled={isLoading}
      >
        <Text style={styles.continueButtonText}>
          {isLoading ? 'Validating...' : 'Continue'}
        </Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Link href="/(authentication)/login" asChild>
            <Text style={styles.loginLink}>Log in here!</Text>
          </Link>
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
    paddingTop: '20%',
    textAlign: 'center'
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 48,
    marginBottom: 16,
    paddingHorizontal: 16,
    color: 'black'
  },
  datePickerIOS: {
    backgroundColor: 'white',
    height: 180,
    marginBottom: 16,
    borderRadius: 8,
  },
  continueButton: {
    backgroundColor: '#F3BC00',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: 'white',
    fontSize: 14,
  },
  loginLink: {
    color: '#F3BC00',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
})

