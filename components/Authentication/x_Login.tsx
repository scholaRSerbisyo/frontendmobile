import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { useNavigation } from '@react-navigation/native';
import { useKeyboard } from '~/lib/keyboard';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { loginUser } from './api/auth';
import NetInfo from "@react-native-community/netinfo";
import { ErrorOverlay } from './components/ErrorOverlay';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginScreen() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigation = useNavigation();
  const { isKeyboardVisible, keyboardHeight, dismissKeyboard } = useKeyboard();

  const handleLogin = async (values: { email: string; password: string }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setErrorMessage(null);
    try {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        setErrorMessage('No internet connection. Please check your network settings and try again.');
        return;
      }

      const response = await loginUser(values.email, values.password);
      console.log('Login successful:', response);
      
      if (response.token) {
        console.log(response.token);
        // Navigate to the main app screen
        // navigation.navigate('Home');
      } else {
        setErrorMessage('Login successful, but no token received. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Animated.View entering={FadeIn.delay(300).duration(1000)} style={styles.logoContainer}>
            <Image
              source={require('../assets/images/final-logo-iskoserbisyo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(800).duration(800)} style={styles.formContainer}>
            <Text style={styles.title}>Log In</Text>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <>
                  <Input
                    placeholder="Email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <View style={styles.passwordContainer}>
                    <Input
                      placeholder="Password"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      secureTextEntry={!isPasswordVisible}
                      style={styles.passwordInput}
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!isPasswordVisible)}
                      style={styles.passwordToggle}
                    >
                      <Text style={styles.toggleText}>
                        {isPasswordVisible ? 'Hide' : 'Show'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  <Button
                    style={styles.continueButton}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.continueButtonText}>
                      {isSubmitting ? 'Logging in...' : 'Continue'}
                    </Text>
                  </Button>
                </>
              )}
            </Formik>

            <TouchableOpacity
              onPress={() => {
                dismissKeyboard();
                console.log('Navigating to registration');
                //navigation.navigate('RegisterNameBirthdate');
              }}
            >
              <Text style={styles.footerText}>
                No account yet? <Text style={styles.linkText}>Register here!</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {isKeyboardVisible && <View style={{ height: keyboardHeight }} />}
      </ScrollView>

      <ErrorOverlay
        visible={!!errorMessage}
        message={errorMessage || ''}
        onClose={() => setErrorMessage(null)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
    marginEnd: 20,
  },
  formContainer: {
    backgroundColor: '#191851',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
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
    color: 'black',
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  passwordInput: {
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
  },
  passwordToggle: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  toggleText: {
    color: '#191851',
    fontSize: 15,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#FDB316',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  continueButtonText: {
    color: '#191851',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#FDB316',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

