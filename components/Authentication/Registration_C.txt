import React, { useState } from 'react'
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useNavigation } from '@react-navigation/native'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const FORM_HEIGHT = SCREEN_HEIGHT * 0.7

export default function RegisterFullInfo() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [yearLevel, setYearLevel] = useState('')
  const [school, setSchool] = useState('')
  const [barangay, setBarangay] = useState('')
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={require('../assets/images/landingpagelogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Registration</Text>
        <Input
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
        />
        <Select defaultValue={gender} onValueChange={setGender}>
          <SelectTrigger style={styles.selectTrigger}>
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent insets={contentInsets} style={styles.selectContent}>
            <SelectGroup>
              <SelectLabel>Gender</SelectLabel>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          placeholder="Mobile Number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
          style={styles.input}
        />
        <Select defaultValue={yearLevel} onValueChange={setYearLevel}>
          <SelectTrigger style={styles.selectTrigger}>
            <SelectValue placeholder="Select Year Level" />
          </SelectTrigger>
          <SelectContent insets={contentInsets} style={styles.selectContent}>
            <SelectGroup>
              <SelectLabel>Year Level</SelectLabel>
              <SelectItem value="1st">1st Year</SelectItem>
              <SelectItem value="2nd">2nd Year</SelectItem>
              <SelectItem value="3rd">3rd Year</SelectItem>
              <SelectItem value="4th">4th Year</SelectItem>
              <SelectItem value="5th">5th Year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select defaultValue={school} onValueChange={setSchool}>
          <SelectTrigger style={styles.selectTrigger}>
            <SelectValue placeholder="Select School" />
          </SelectTrigger>
          <SelectContent insets={contentInsets} style={styles.selectContent}>
            <SelectGroup>
              <SelectLabel>Schools</SelectLabel>
              <SelectItem value="schoolA">School A</SelectItem>
              <SelectItem value="schoolB">School B</SelectItem>
              <SelectItem value="schoolC">School C</SelectItem>
              <SelectItem value="schoolD">School D</SelectItem>
              <SelectItem value="schoolE">School E</SelectItem>
              <SelectItem value="schoolF">School F</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select defaultValue={barangay} onValueChange={setBarangay}>
          <SelectTrigger style={styles.selectTrigger}>
            <SelectValue placeholder="Select Barangay" />
          </SelectTrigger>
          <SelectContent insets={contentInsets} style={styles.selectContent}>
            <SelectGroup>
              <SelectLabel>Barangays</SelectLabel>
              <SelectItem value="barangay1">Barangay 1</SelectItem>
              <SelectItem value="barangay2">Barangay 2</SelectItem>
              <SelectItem value="barangay3">Barangay 3</SelectItem>
              <SelectItem value="barangay4">Barangay 4</SelectItem>
              <SelectItem value="barangay5">Barangay 5</SelectItem>
              <SelectItem value="barangay6">Barangay 6</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.buttonText}>Back</Text>
          </Button>
          <Button
            onPress={() => console.log('Registration completed')}
            style={styles.continueButton}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  logo: {
    width: 250,
    height: 80,
    alignSelf: 'center',
    marginTop: 60,
  },
  formContainer: {
    backgroundColor: '#191851',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: 40,
    height: FORM_HEIGHT,
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
  selectTrigger: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  selectContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    maxHeight: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#FDB316',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  continueButton: {
    backgroundColor: '#FDB316',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: '#191851',
    fontSize: 16,
    fontWeight: 'bold',
  },
})