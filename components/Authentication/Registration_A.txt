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
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { useNavigation } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RegisterNameBirthdate() {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();

  const logoPosition = useSharedValue(SCREEN_HEIGHT * 0.3);
  const logoOpacity = useSharedValue(1); // New shared value for opacity

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        logoPosition.value = withTiming(60, {
          duration: 10,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
        logoOpacity.value = withTiming(0, {
          duration: 10,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        logoPosition.value = withTiming(SCREEN_HEIGHT * 0.3, {
          duration: 300,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
        logoOpacity.value = withTiming(1, {
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
    opacity: logoOpacity.value, // Apply the opacity value
  }));

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const onChangeBirthdate = (event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    const currentDate = selectedDate || birthdate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthdate(currentDate);
    setFormattedDate(formatDate(currentDate));
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
              source={require('../assets/images/landingpagelogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Registration</Text>
            <Input
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
            />
            <Input
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Input
                placeholder="Birthdate"
                value={formattedDate || 'Select Birthdate'}
                editable={false}
                style={styles.inputdate}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthdate}
                mode="date"
                display="spinner"
                onChange={onChangeBirthdate}
                maximumDate={new Date()}
              />
            )}
            <Button
              onPress={() => console.log('Submitting form with:', {
                lastName,
                firstName,
                formattedDate,
              })}
              style={styles.continueButton}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </Button>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginLink} onPress={() => navigation.goBack()}>
                Log in here!
              </Text>
            </Text>
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
    flex: 1,
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
    paddingTop: 10,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 15,
    color: 'black',
  },
  inputdate: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 15,
    color: 'black',
    textAlignVertical: 'center',
  },
  continueButton: {
    backgroundColor: '#FDB316',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#191851',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  loginLink: {
    color: '#FDB316',
    fontWeight: 'bold',
  },
});
