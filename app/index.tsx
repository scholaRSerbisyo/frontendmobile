import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { router } from 'expo-router';

export default function LogoutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/final-logo-iskoserbisyo.png')} // Replace with your logo path
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Log Out</Text>
        <Text style={styles.message}>
          Are you sure that you want to log out?
        </Text>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            console.log('User logged out');
            router.replace('/pages/calendar');
          }}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Dark blue background
  },
  logoContainer: {
    alignItems: 'center',
    // marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 150,
  },
  contentContainer: {
    backgroundColor: '#191851',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white', // Dark blue text
    marginBottom: 15,
    paddingTop: "25%"
  },
  message: {
    fontSize: 16,
    color: 'white', // Gray message text
    textAlign: 'center',
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: '#FDB316', // Golden yellow
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginBottom: 15,
  },
  continueButtonText: {
    color: 'white', // White text
    fontSize: 16,
    fontWeight: 'bold', 
  },
  cancelButton: {
    backgroundColor: '#FDB316', // White button
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    borderWidth: 2,
    borderColor: '#FDB316', // Golden yellow border
  },
  cancelButtonText: {
    color: 'white', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});
