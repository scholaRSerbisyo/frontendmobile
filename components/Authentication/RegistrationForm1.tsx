import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { Link, useRouter } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Text } from '../ui/text'
import { Input } from '../ui/input'

export function RegistrationForm1() {
  const router = useRouter()
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [date, setDate] = useState(new Date())
  const [showPicker, setShowPicker] = useState(false)

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date
    setShowPicker(Platform.OS === 'ios')
    setDate(currentDate)
  }

  const showDatepicker = () => {
    setShowPicker(true)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Registration</Text>

      <Input
        placeholder="LastName"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <Input
        placeholder="FirstName"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      {Platform.OS === 'ios' ? (
        <View>
          <TouchableOpacity onPress={showDatepicker}>
            <Input
              placeholder="Birthdate"
              value={formatDate(date)}
              editable={false}
              style={styles.input}
            />
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display="spinner"
              onChange={onChange}
              maximumDate={new Date()}
              style={styles.datePickerIOS}
            />
          )}
        </View>
      ) : (
        <View>
          <TouchableOpacity onPress={showDatepicker}>
            <Input
              placeholder="Birthdate"
              value={formatDate(date)}
              editable={false}
              style={styles.input}
            />
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display="spinner"
              onChange={onChange}
              maximumDate={new Date()}
            />
          )}
        </View>
      )}

      <TouchableOpacity 
        style={styles.continueButton}
        onPress={() => router.push('/(authentication)/registeruserpass')}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>
          Already, have an account?{' '}
          <Link href="/(authentication)/login" asChild>
              <Text
                onPress={() => router.push('/(authentication)/register')}
                style={styles.loginLink}>Log in here!</Text>

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
  datePickerIOS: {
    backgroundColor: 'white',
    height: 180,
    marginBottom: 16,
    borderRadius: 8,
  },
  continueButton: {
    backgroundColor: '#FDB316',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
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
    color: '#FDB316',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
})

