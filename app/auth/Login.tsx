import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '~/constants/constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const FORM_HEIGHT = SCREEN_HEIGHT * 0.45;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const logoPosition = useSharedValue(SCREEN_HEIGHT * 0.3);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        logoPosition.value = withTiming(60, {
          duration: 300,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        logoPosition.value = withTiming(SCREEN_HEIGHT * 0.3, {
          duration: 300,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoPosition.value }],
  }));

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/user/login`, {
        email: email.trim(),
        password: password,
      });

      const accessToken = response.data.access_token;

      if (accessToken) {
        await AsyncStorage.setItem('access_token', accessToken);
        Alert.alert('Success', 'Login successful!');
        console.log("test done")
        // navigation.navigate(''); // Navigate to Home screen
      } else {
        Alert.alert('Error', 'Login failed. No access token received.');
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || 'Invalid email or password';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Animated.View style={[styles.logoContainer, logoStyle]}>
            <Image
              source={require('../../assets/images/landingpagelogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Log In</Text>

            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
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
              onPress={handleLogin}
              style={styles.continueButton}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Logging in...' : 'Continue'}
              </Text>
            </Button>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                No account yet?{' '}
                <Text
                  style={styles.registerLink}
                  onPress={() => navigation.navigate('Registration_A')}
                >
                  Register here!
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
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
    color: 'black',
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
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 14,
  },
  registerLink: {
    color: '#FDB316',
    fontWeight: 'bold',
  },
});
