import React from 'react'
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native'
import { Text
 } from '~/components/ui/text'
interface CalendarEventModalProps {
  visible: boolean
  onClose: () => void
  selectedDate: string
  event?: {
    title: string
    location: string
    time: string
    type: string
  } | null
}

export function CalendarEventModal({ visible, onClose, selectedDate, event }: CalendarEventModalProps) {
  const formattedDate = selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : ''

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity>
              <ChevronLeft size={20} color="#191851" />
            </TouchableOpacity>
            <Text style={styles.dateText}>{formattedDate}</Text>
            <TouchableOpacity>
              <ChevronRight size={20} color="#191851" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#191851" />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            {event ? (
              <>
                <View style={styles.formField}>
                  <Text style={styles.label}>Event Title:</Text>
                  <Text style={styles.value}>{event.title}</Text>
                </View>

                <View style={styles.formField}>
                  <Text style={styles.label}>Location:</Text>
                  <Text style={styles.value}>{event.location}</Text>
                </View>

                <View style={styles.formField}>
                  <Text style={styles.label}>Time:</Text>
                  <Text style={styles.value}>{event.time}</Text>
                </View>

                <View style={styles.formField}>
                  <Text style={styles.label}>Type of Event:</Text>
                  <Text style={styles.value}>{event.type}</Text>
                </View>
              </>
            ) : (
              <Text style={styles.noEventText}>No event scheduled for this date.</Text>
            )}
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
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  dateText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#191851',
    marginHorizontal: 10,
  },
  closeButton: {
    position: 'absolute',
    right: -10,
    top: -5,
  },
  form: {
    gap: 16,
  },
  formField: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    color: '#666666',
  },
  value: {
    fontSize: 16,
    color: '#191851',
  },
  noEventText: {
    fontSize: 16,
    color: '#191851',
    textAlign: 'center',
  },
})

