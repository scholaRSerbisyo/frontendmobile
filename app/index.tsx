import * as React from 'react'
import { View, Image, StyleSheet, Platform } from 'react-native'
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
import { Button } from '../components/ui/button'
import { Link } from 'expo-router'
import { Text } from '../components/ui/text'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'
export default function LandingPage() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.contentContainer}>
        <Animated.View 
          entering={FadeIn.delay(300).duration(1000)} 
          style={styles.logoContainer}
        >
          <Image
            source={require('../assets/images/final-logo-iskoserbisyo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Scholar Serbisyo Logo"
          />
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(800).duration(800)}
          style={styles.buttonContainer}
        >
          {/* <Link href="/profile\total-rs" asChild> */}
            <Button 
            onPress={() => router.replace('/(authentication)/login')}

            style={styles.continueButton}>
              <Text style={styles.continueButtonText}>
                Good day, Scholars!
              </Text>
            </Button>
          {/* </Link> */}
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: undefined, // Reduced space between logo and button
  },
  logo: {
    width: 280,
    height: 180,
  },
  buttonContainer: {
    width: '80%',
  },
  continueButton: {
    backgroundColor: '#F3BC00',
    height: 50,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueButtonText: {
    color: '#343474',
    fontSize: 18,
    fontWeight: 'bold',
  },
})

