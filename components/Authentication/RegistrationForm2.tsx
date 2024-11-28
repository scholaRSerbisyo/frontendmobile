import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Text } from '../ui/text'
import { Input } from '../ui/input'

export function RegistrationForm2() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setPasswordVisible] = useState(false)
  const router = useRouter()

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Registration</Text>

      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <View style={styles.passwordContainer}>
        <Input
          placeholder="Password"
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
          style={styles.continueButton}
          onPress={() => router.push('/(authentication)/registerfulldetails')}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  passwordContainer: {
    position: 'relative',
  },
  showButton: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  showButtonText: {
    color: '#191851',
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
  buttonText: {
    color: '#191851',
    fontSize: 16,
    fontWeight: '600',
  },
})

