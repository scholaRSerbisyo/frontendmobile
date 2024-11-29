import React from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import { Image } from 'lucide-react-native'

const photos = Array(12).fill({
  url: 'https://i.pravatar.cc/300',
  id: Math.random().toString()
})

export function RSPhotos() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.grid}>
        {photos.map((photo, index) => (
          <TouchableOpacity key={photo.id} style={styles.photoContainer}>
            <View style={styles.thumbnail}>
              <View style={styles.searchButton}>
                <Image size={20} color="#191851" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const windowWidth = Dimensions.get('window').width
const itemWidth = (windowWidth - 64) / 3 // 3 columns with padding

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  photoContainer: {
    width: itemWidth,
    aspectRatio: 1,
  },
  thumbnail: {
    flex: 1,
    backgroundColor: '#232164',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDB316',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
})

