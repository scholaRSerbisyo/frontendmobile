import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Text } from '../ui/text'
import { Input } from '../ui/input'

export function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setPasswordVisible] = useState(false)
  const router = useRouter()

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Log In</Text>

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

      <TouchableOpacity 
        onPress={() => router.push('/newsfeed/homescreen')}
        style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          No account yet?{' '}
          <Text 
            onPress={() => router.push('/(authentication)/register')}
            style={styles.registerLink}
          >
            Register here!
          </Text>
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    // paddingTop: '10%',
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
  registerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: 'white',
    fontSize: 14,
  },
  registerLink: {
    color: '#FDB316',
    fontWeight:'bold',
    textDecorationLine: 'underline'
  },
})

