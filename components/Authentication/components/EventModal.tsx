import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';

interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export function EventModal({ visible, onClose, selectedDate, onPrevDay, onNextDay }: EventModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onPrevDay}>
              <ChevronLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString('en-US', { 
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
            <TouchableOpacity onPress={onNextDay}>
              <ChevronRight size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Event Title:</Text>
              <View style={styles.input} />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location:</Text>
              <View style={styles.input} />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Time:</Text>
              <View style={styles.input} />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Type of Event:</Text>
              <View style={styles.input} />
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
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  form: {
    gap: 15,
  },
  formGroup: {
    gap: 5,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});

