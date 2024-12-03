import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { Text } from '~/components/ui/text';

interface CalendarEventModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: string;
  event?: {
    title: string;
    location: string;
    time: string;
    type: string;
  } | null;
} 

export function CalendarEventModal({ visible, onClose, selectedDate, event }: CalendarEventModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePreviousDay = () => {
    setCurrentDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1)));
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1)));
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.navigationContainer}>
              <TouchableOpacity style={styles.navigationButton} onPress={handlePreviousDay}>
                <ChevronLeft size={20} color="#191851" />
              </TouchableOpacity>
              <Text style={styles.dateText}>{formattedDate}</Text>
              <TouchableOpacity style={styles.navigationButton} onPress={handleNextDay}>
                <ChevronRight size={20} color="#191851" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#191851" />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.formField}>
              <Text style={styles.label}>Event Title:</Text>
              <Text style={styles.value}>{event?.title || ''}</Text>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Start:</Text>
              <Text style={styles.value}>{event?.time || ''}</Text>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>End:</Text>
              <Text style={styles.value}>{event?.time || ''}</Text>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>{event?.location || ''}</Text>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Type of Event:</Text>
              <Text style={styles.value}>{event?.type || ''}</Text>
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.value}>{event?.type || ''}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navigationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  navigationButton: {
    padding: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#191851',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    gap: 16,
  },
  formField: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    color: '#191851',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#666666',
  },
});
