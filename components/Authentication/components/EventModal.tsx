import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { X } from 'lucide-react-native';

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
            <TouchableOpacity onPress={onPrevDay} style={styles.navButton}>
              <Text style={styles.navIcon}>{'<'}</Text>
            </TouchableOpacity>
            
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString('en-US', { 
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
            
            <TouchableOpacity onPress={onNextDay} style={styles.navButton}>
              <Text style={styles.navIcon}>{'>'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Event Title:</Text>
              <TextInput style={styles.input} />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location:</Text>
              <TextInput style={styles.input} />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Time:</Text>
              <TextInput style={styles.input} />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Type of Event:</Text>
              <TextInput style={styles.input} />
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
    borderRadius: 15,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 15,
  },
  navButton: {
    padding: 10,
  },
  navIcon: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    right: -10,
    top: -10,
    padding: 10,
  },
  closeIcon: {
    fontSize: 20,
    fontWeight: '300',
  },
  form: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
});

