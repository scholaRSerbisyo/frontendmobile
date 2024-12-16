import React from 'react'
import { View, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Text } from '~/components/ui/text'
import { X } from 'lucide-react-native'

interface RSMonthlyModalProps {
  isVisible: boolean
  onClose: () => void
  year: number
  semester: string
  monthlyData: Array<{
    month: string
    approvedRS: number
  }>
  totalRS: number
  requiredRS: number
}

export default function RSMonthlyModal({
  isVisible,
  onClose,
  year,
  semester,
  monthlyData,
  totalRS,
  requiredRS
}: RSMonthlyModalProps) {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Title and Close Button */}
          <View style={styles.titleContainer}>
            <TouchableOpacity 
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.closeButton}
            >
              <X size={20} color="#F3BC00" />
            </TouchableOpacity>
            <Text style={styles.titleText}>Year: {year} - {semester}</Text>
          </View>

          {/* Table Header */}
          <View style={styles.headerRow}>
            <View style={styles.leftColumn}>
              <Text style={styles.headerText}>Month</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={[styles.headerText, styles.rightAlign]}>No. of Approved RS</Text>
            </View>
          </View>

          {/* Table Content */}
          <ScrollView style={styles.contentContainer}>
            {monthlyData.map((item, index) => (
              <View key={item.month} style={styles.row}>
                <View style={styles.leftColumn}>
                  <Text style={styles.monthText}>{item.month}</Text>
                </View>
                <View style={styles.rightColumn}>
                  <Text style={[styles.rsText, styles.rightAlign]}>{item.approvedRS}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total RS: {totalRS}/{requiredRS}</Text>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '95%',
    maxWidth: 500,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 16,
  },
  titleText: {
    fontSize: 16,
    color: 'grey',
    fontWeight: '500',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    maxHeight: 300,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  leftColumn: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 20,
    paddingRight: 10,
  },
  rightColumn: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 10,
    paddingRight: 20,
  },
  monthText: {
    fontSize: 14,
    color: '#333333',
  },
  rsText: {
    fontSize: 14,
    color: '#333333',
  },
  rightAlign: {
    textAlign: 'right',
  },
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 14,
    color: '#666666',
  },
})

