import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Text } from '../ui/text'

export function LogoutConfirm() {
  const router = useRouter()

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Log Out</Text>

      <Text style={styles.confirmText}>
        Are you sure you want to log out?
      </Text>

      <TouchableOpacity 
        style={styles.continueButton}
        onPress={() => router.replace('/(authentication)/login')}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
    textAlign: 'center',
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  continueButton: {
    backgroundColor: '#F3BC00',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: '#F3BC00',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#343474',
    fontSize: 16,
    fontWeight: '600',
  },
})

