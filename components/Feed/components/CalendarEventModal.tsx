import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import { format, parse } from 'date-fns';

interface CalendarEventModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: string;
  event?: {
    event_id: number;
    event_name: string;
    description: string;
    location: string;
    date: string;
    time_from: string;
    time_to: string;
    status: 'previous' | 'ongoing' | 'upcoming';
    event_type: {
      name: string;
    };
  } | null;
}

const CalendarEventModal: React.FC<CalendarEventModalProps> = ({ visible, onClose, selectedDate, event }) => {
  if (!event) return null;

  const formatDate = (dateString: string) => {
    return format(parse(dateString, 'yyyy-MM-dd', new Date()), 'MMMM d yyyy');
  };

  const formatTime = (timeString: string) => {
    let date = parse(timeString, 'HH:mm:ss', new Date());
    if (isNaN(date.getTime())) {
      date = parse(timeString, 'HH:mm', new Date());
    }
    if (isNaN(date.getTime())) {
      return timeString;
    }
    return format(date, 'h:mm a');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.dateNavigation}>
              <TouchableOpacity>
                <ChevronLeft size={20} color="#191851" />
              </TouchableOpacity>
              <Text style={styles.dateText}>{formatDate(event.date)}</Text>
              <TouchableOpacity>
                <ChevronRight size={20} color="#191851" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#191851" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.scrollContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Event Title:</Text>
              <Text style={styles.value}>{event.event_name}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Start:</Text>
              <Text style={styles.value}>{formatTime(event.time_from)}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>End:</Text>
              <Text style={styles.value}>{formatTime(event.time_to)}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>{event.location}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Type of Event:</Text>
              <Text style={styles.value}>{event.event_type.name}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.value}>{event.description}</Text>
            </View>

            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, styles[event.status]]}>
                {event.status === 'previous' ? 'Previous Return Service' : 
                 event.status === 'ongoing' ? 'Ongoing Return Service' : 
                 'Upcoming Return Service'}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: '80%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#191851',
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#191851',
    fontWeight: '500',
  },
  statusContainer: {
    marginTop: 24,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  previous: {
    color: '#FF3B30',
  },
  ongoing: {
    color: '#34C759',
  },
  upcoming: {
    color: '#007AFF',
  },
});

export default CalendarEventModal;
