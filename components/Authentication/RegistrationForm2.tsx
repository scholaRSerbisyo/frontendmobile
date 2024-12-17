import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Text } from '../ui/text'
import { Input } from '../ui/input'
import axios, { AxiosError } from 'axios'
import API_URL from '~/constants/constants'

export function RegistrationForm2() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { scholarId } = useLocalSearchParams()

  const handleRegistration = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }

    // Password length validation
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    try {
      console.log('Attempting to register with URL:', `${API_URL}/user/register-scholar-user`)
      const response = await axios.post(`${API_URL}/user/register-scholar-user`, {
        scholar_id: scholarId,
        email,
        password,
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      console.log('Registration response:', response.data)

      if (response.status === 201) {
        Alert.alert('Success', 'Registration successful!', [
          { text: 'OK', onPress: () => router.push('/(authentication)/registerfulldetails') }
        ])
      } else {
        Alert.alert('Error', response.data.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.log('Registration error:', error)
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>
        if (axiosError.response) {
          if (axiosError.response.status === 404) {
            console.log('API Endpoint not found:', `${API_URL}/user/register-scholar-user`)
            Alert.alert('Error', 'The registration service is currently unavailable. Please try again later or contact support.')
          } else if (axiosError.response.status === 422) {
            // Validation error
            const errorMessage = axiosError.response.data.message || 'Validation failed. Please check your input.'
            Alert.alert('Validation Error', errorMessage)
          } else {
            // Other server errors
            console.log('Server Error:', axiosError.response.status, axiosError.response.data)
            Alert.alert('Server Error', 'An unexpected error occurred. Please try again later.')
          }
        } else if (axiosError.request) {
          // Network error
          console.log('Network Error:', axiosError.request)
          Alert.alert('Network Error', 'Unable to connect to the server. Please check your internet connection.')
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Request Setup Error:', axiosError.message)
          Alert.alert('Error', 'An unexpected error occurred. Please try again.')
        }
      } else {
        // Non-Axios error
        console.log('Non-Axios Error:', error)
        Alert.alert('Error', 'An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Registration</Text>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <View style={styles.passwordContainer}>
        <Input
          placeholder="Password (min 8 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!isPasswordVisible)}
          style={styles.showButton}
        >
          <Text style={styles.showButtonText}>
            {isPasswordVisible ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.continueButton, isLoading && styles.disabledButton]}
          onPress={handleRegistration}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Registering...' : 'Continue'}
          </Text>
        </TouchableOpacity>
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
    fontSize: 36,
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
  passwordContainer: {
    position: 'relative',
  },
  showButton: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  showButtonText: {
    color: '#343474',
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#FDB316',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
  },
  continueButton: {
    backgroundColor: '#FDB316',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#343474',
    fontSize: 16,
    fontWeight: '600',
  },
})

