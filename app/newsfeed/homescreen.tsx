import React, { useState } from 'react'
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Modal,
  SafeAreaView,
  StatusBar 
} from 'react-native'
import { Text } from '~/components/ui/text'
import { Card } from '~/components/ui/card'
import { Calendar } from 'lucide-react-native'
import { router } from 'expo-router'
export default function HomeScreen() {
  const [isCommentsVisible, setCommentsVisible] = useState(false)

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity style={styles.calendarButton}
          onPress={() => router.navigate('/(calendar)/calendar')}
          >
            <Calendar color="#FDB316" size={24} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.sectionTitle}>Scholar's Cup</Text>
          <Card style={styles.eventCard}>
            <Image
              source={require('../../assets/images/2nd-type-logo.png')}
              style={styles.eventImage}
              resizeMode="cover"
            />
            <View style={styles.eventDetails}>
              <Text style={styles.detailText}>Date: Jun 17, 2024</Text>
              <Text style={styles.detailText}>Time: 3pm</Text>
              <Text style={styles.detailText}>Location: Sport Center</Text>
              <Text style={styles.detailText}>Type of Event: CSO base</Text>
              <Text style={styles.descriptionText}>
                Description: Fostering discipline, teamwork, leadership, respect, and time management.
                Building character through sports.
              </Text>
              <TouchableOpacity
                onPress={() => setCommentsVisible(true)}
                style={styles.viewCommentsButton}
              >
                <Text style={styles.viewCommentsText}>View All Comments</Text>
              </TouchableOpacity>
            </View>
          </Card>

          <Text style={styles.sectionTitle}>Kahupayan</Text>
          <Card style={styles.kahupayanCard}>
            <Image
              source={require('../../assets/images/2nd-type-logo.png')}
              style={styles.kahupayanImage}
              resizeMode="cover"
            />
          </Card>
        </ScrollView>

        <Modal
          visible={isCommentsVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setCommentsVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Comments</Text>
                <TouchableOpacity 
                  onPress={() => setCommentsVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.commentsList}>
                {/* Add your comments here */}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    borderColor: "red",
    borderWidth: 2,
    marginTop: 35,
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'white',
    // marginTop: "20%"
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  eventCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#191851',
  },
  eventDetails: {
    padding: 16,
    backgroundColor: 'white',
  },
  detailText: {
    color: '#000000',
    fontSize: 16,
    marginBottom: 8,
  },
  descriptionText: {
    color: '#666666',
    fontSize: 16,
    marginBottom: 16,
  },
  viewCommentsButton: {
    marginTop: 8,
  },
  viewCommentsText: {
    color: '#191851',
    fontSize: 16,
    fontWeight: '500',

},
  kahupayanCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  kahupayanImage: {
    width: '100%',
    height: 120,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666666',
  },
  commentsList: {
    flex: 1,
  },
})