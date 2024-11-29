import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { ChevronLeft, MoreVertical } from 'lucide-react-native'
import { Text } from '~/components/ui/text'
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <MoreVertical size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.profile}>
        <Image
          source={{ uri: photo }}
          style={styles.photo}
        />
        <Text style={styles.name}>{name}</Text>
        <View style={styles.info}>
          <Text style={styles.infoText}>📚 studied at {school}</Text>
          <Text style={styles.infoText}>📍 Live in {location}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#191851',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profile: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  info: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#FFF',
    marginVertical: 2,
  },
})

