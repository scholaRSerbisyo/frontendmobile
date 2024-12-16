import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Text } from '~/components/ui/text'
import RSMonthlyModal from '~/components/Profile/Modal/RSMonthlyModal'

export default function ModalScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const monthlyData = [
    { month: 'July', approvedRS: 1 },
    { month: 'August', approvedRS: 0 },
    { month: 'September', approvedRS: 2 },
    { month: 'October', approvedRS: 1 },
    { month: 'November', approvedRS: 1 },
    { month: 'December', approvedRS: 0 },
  ]

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>View Monthly RS</Text>
      </TouchableOpacity>

      <RSMonthlyModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        year={2024}
        semester="1st Semester"
        monthlyData={monthlyData}
        totalRS={5}
        requiredRS={5}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  button: {
    backgroundColor: '#343474',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
})

