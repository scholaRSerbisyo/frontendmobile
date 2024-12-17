import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { ChevronDown } from 'lucide-react-native'
import { Text } from '../ui/text'
import { Input } from '../ui/input'

export function RegistrationForm3() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    mobileNumber: '',
    yearLevel: '',
    school: '',
    barangay: '',
  })
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const genderOptions = ['Male', 'Female', 'Other']
  const yearLevelOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year']
  const schoolOptions = ['University of San Carlos', 'Cebu Institute of Technology - University', 'University of Cebu']
  const barangayOptions = ['Lahug', 'Kamputhaw', 'Mabolo']

  const handleSelect = (value: string) => {
    if (activeDropdown) {
      setFormData(prev => ({ ...prev, [activeDropdown]: value }))
      setActiveDropdown(null)
    }
  }

  const renderDropdown = (field: string, value: string, placeholder: string, options: string[]) => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={styles.dropdownButton} 
        onPress={() => setActiveDropdown(field)}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color="#343474" />
      </TouchableOpacity>
    </View>
  )

  return (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.title}>Registration</Text>

      <Input
        placeholder="Age"
        value={formData.age}
        onChangeText={(text) => setFormData({ ...formData, age: text })}
        style={styles.input}
        keyboardType="numeric"
      />

      {renderDropdown('gender', formData.gender, 'Gender', genderOptions)}

      <Input
        placeholder="Mobile Number"
        value={formData.mobileNumber}
        onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
        style={styles.input}
        keyboardType="phone-pad"
      />

      {renderDropdown('yearLevel', formData.yearLevel, 'Year Level', yearLevelOptions)}
      {renderDropdown('school', formData.school, 'School', schoolOptions)}
      {renderDropdown('barangay', formData.barangay, 'Barangay', barangayOptions)}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => router.push('/(authentication)/login')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={!!activeDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveDropdown(null)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setActiveDropdown(null)}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {activeDropdown && (
                {
                  'gender': genderOptions,
                  'yearLevel': yearLevelOptions,
                  'school': schoolOptions,
                  'barangay': barangayOptions,
                }[activeDropdown].map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionButton}
                    onPress={() => handleSelect(option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
    paddingTop: '20%',
    textAlign: 'center'
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 48,
    marginBottom: 16,
    paddingHorizontal: 16,
    color: 'black'
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  placeholder: {
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    padding: 8,
  },
  optionButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#343474',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#FDB316',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
  },
  continueButton: {
    backgroundColor: '#FDB316',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#343474',
    fontSize: 16,
    fontWeight: '600',
  },
})

