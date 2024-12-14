import React from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import { ImagePlay } from 'lucide-react-native'

const videos = Array(8).fill({
  thumbnail: 'https://i.pravatar.cc/300',
  id: Math.random().toString()
})

export function RSVideos() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.grid}>
        {videos.map((video, index) => (
          <TouchableOpacity key={video.id} style={styles.videoContainer}>
            <View style={styles.thumbnail}>
              <View style={styles.playButton}>
                <ImagePlay size={24} color="#F3BC00" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const windowWidth = Dimensions.get('window').width
const itemWidth = (windowWidth - 48) / 2 // 2 columns with padding

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
  videoContainer: {
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
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
})

