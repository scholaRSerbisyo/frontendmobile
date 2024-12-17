import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image as RNImage, ActivityIndicator, Modal } from 'react-native'
import { Image, X } from 'lucide-react-native'
import { getImageUrl } from '../services/imageService'
import { Text } from '../ui/text'

interface PhotoData {
  image_uuid: string;
  event_name: string;
}

interface RSPhotosProps {
  photos: PhotoData[];
}

const ImageOverlay = ({ imageUrl, eventName, onClose }: { imageUrl: string, eventName: string, onClose: () => void }) => (
  <View style={styles.overlayContainer}>
    <View style={styles.overlayHeader}>
      <Text style={styles.overlayTitle}>{eventName}</Text>
      <TouchableOpacity onPress={onClose}>
        <X size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
    <RNImage source={{ uri: imageUrl }} style={styles.overlayImage} resizeMode="contain" />
  </View>
)

export function RSPhotos({ photos }: RSPhotosProps) {
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string | null }>({});
  const [selectedImage, setSelectedImage] = useState<PhotoData | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    const fetchImageUrls = async () => {
      const urlPromises = photos.map(async (photo) => {
        const url = await getImageUrl(photo.image_uuid);
        return { [photo.image_uuid]: url };
      });

      const urlResults = await Promise.all(urlPromises);
      const urlMap = Object.assign({}, ...urlResults);
      setImageUrls(urlMap);
    };

    fetchImageUrls();
  }, [photos]);

  const handleImagePress = (photo: PhotoData) => {
    setSelectedImage(photo);
    setIsOverlayVisible(true);
  };

  const closeOverlay = () => {
    setIsOverlayVisible(false);
    setSelectedImage(null);
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {photos.length === 0 ? (
        <Text style={styles.noPhotosText}>No Photos Submitted found</Text>
      ) : (
        <View style={styles.grid}>
          {photos.map((photo, index) => (
            <TouchableOpacity 
              key={photo.image_uuid} 
              style={styles.photoContainer}
              onPress={() => handleImagePress(photo)}
            >
              <View style={styles.thumbnail}>
                {imageUrls[photo.image_uuid] ? (
                  <RNImage
                    source={{ uri: imageUrls[photo.image_uuid] || undefined }}
                    style={styles.image}
                  />
                ) : (
                  <ActivityIndicator size="small" color="#F3BC00" />
                )}
                <View style={styles.searchButton}>
                  <Image size={20} color="#343474" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      </ScrollView>
      <Modal
        visible={isOverlayVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeOverlay}
      >
        {selectedImage && imageUrls[selectedImage.image_uuid] && (
          <ImageOverlay
            imageUrl={imageUrls[selectedImage.image_uuid]!}
            eventName={selectedImage.event_name}
            onClose={closeOverlay}
          />
        )}
      </Modal>
    </>
  )
}

const windowWidth = Dimensions.get('window').width
const itemWidth = (windowWidth - 48) / 3 // 3 columns with 16px gap

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: itemWidth,
    aspectRatio: 1,
    marginBottom: 16,
  },
  thumbnail: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  searchButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3BC00',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayHeader: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  overlayImage: {
    width: '100%',
    height: '80%',
  },
  noPhotosText: {
    fontSize: 18,
    color: '#343474',
    textAlign: 'center',
    marginTop: 20,
  },
})

