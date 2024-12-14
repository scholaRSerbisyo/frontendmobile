import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RegistrationForm1 } from '~/components/Authentication/RegistrationForm1'

export default function RegisterScreen1() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/2nd-type-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.bottomSection}>
        <RegistrationForm1 />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: '100%',
    height: 100,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#343474',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
})

