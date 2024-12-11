import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { ChevronLeft, GraduationCap, MapPin, Menu } from 'lucide-react-native'
import { Text } from '../ui/text'
import { useRouter } from 'expo-router'

interface RSHeaderProps {
  name: string
  school: string
  location: string
  photo: string
}

export function RSHeader({ name, school, location, photo }: RSHeaderProps) {
  const router = useRouter()

  return (
    <>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="#FDB316" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Menu color="#FDB316" size={24} />
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.bottomSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: photo }}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <GraduationCap color="#FDB316" size={16} />
            <Text style={styles.detailText}>
              Studied at <Text style={styles.detailBold}>{school}</Text>
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin color="#FDB316" size={16} />
            <Text style={styles.detailText}>
              Live in <Text style={styles.detailBold}>{location}</Text>
            </Text>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  topSection: {
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 24,
    paddingBottom: 64,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  menuButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'black',
    color: 'white',
    marginTop: 20,
    paddingTop: 12,
  },
  nameContainer: {
    position: 'absolute',
    bottom: 12,
    left: 140,
    right: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    paddingTop: 16
  },
  divider: {
    height: 4,
    backgroundColor: '#FFA500',
  },
  bottomSection: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
  },
  profileImageContainer: {
    position: 'absolute',
    top: -48,
    left: 24,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: 'white',
    overflow: 'hidden',
    zIndex: 1,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    marginLeft: 116,
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  detailBold: {
    color: '#333',
    fontWeight: '500',
  },
})

