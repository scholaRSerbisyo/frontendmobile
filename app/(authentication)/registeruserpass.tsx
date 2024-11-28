import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RegistrationForm2 } from '~/components/Authentication/RegistrationForm2'

export default function RegisterScreen2() {
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
        <RegistrationForm2 />
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
    backgroundColor: '#191851',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
})
