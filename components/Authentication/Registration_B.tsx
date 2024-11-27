import React, { useState, useEffect } from 'react'
import {
  View,
  Image,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Dimensions,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useNavigation } from '@react-navigation/native'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const FORM_HEIGHT = SCREEN_HEIGHT * 0.45

export default function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setPasswordVisible] = useState(false)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const navigation = useNavigation()

  const logoPosition = useSharedValue(SCREEN_HEIGHT * 0.3) // Initial center position

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true)
        logoPosition.value = withTiming(60, {
          duration: 300,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        })
      }
    )

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false)
        logoPosition.value = withTiming(SCREEN_HEIGHT * 0.3, {
          duration: 300,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        })
      }
    )

    return () => {
      keyboardWillShow.remove()
      keyboardWillHide.remove()
    }
  }, [])

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoPosition.value }],
  }))

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Animated.View style={[styles.logoContainer, logoStyle]}>
            <Image
              source={require('../assets/images/landingpagelogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

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
              <Text
                onPress={() => setPasswordVisible(!isPasswordVisible)}
                style={styles.showButton}
              >
                {isPasswordVisible ? 'Hide' : 'Show'}
              </Text>
            </View>

            <Button
              onPress={() => console.log('Login pressed')}
              style={styles.continueButton}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </Button>

          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  inner: {
    flex: 1,
  },
  logoContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  logo: {
    width: 250,
    height: 80,
  },
  formContainer: {
    backgroundColor: '#191851',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    height: FORM_HEIGHT,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  showButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    color: '#191851',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#FDB316',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#191851',
    fontSize: 16,
    fontWeight: 'bold',
  },
})