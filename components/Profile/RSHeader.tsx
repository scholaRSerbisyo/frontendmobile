import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { ChevronLeft, Menu } from 'lucide-react-native'
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
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/(profile)/burger-menu')}>
          <View style={styles.menuDots}>
            <Menu style={styles.dot} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: photo }}
          style={styles.photo}
        />
        <Text style={styles.name}>{name}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📚</Text>
            <Text style={styles.infoText}>
              Studied at <Text style={styles.infoHighlight}>{school}</Text>
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>
              Live in <Text style={styles.infoHighlight}>{location}</Text>
            </Text>
          </View>
        </View>
        <View style={styles.yellowBar} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#191851',
    paddingTop: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  menuDots: {
    flexDirection: 'row',
    // gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    // backgroundColor: '#FFF',
    color: 'white'
  },
  profileSection: {
    alignItems: 'center',
    paddingBottom: 16,
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  infoContainer: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#FFF',
  },
  infoHighlight: {
    color: '#FDB316',
  },
  yellowBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FDB316',
  },
})

