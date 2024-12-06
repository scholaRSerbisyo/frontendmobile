import React from 'react';
import { Fontisto } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View, Text, Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

interface PhotoPreviewSectionProps {
  photo: CameraCapturedPicture & { exif?: { GPSLatitude?: number; GPSLongitude?: number; Orientation?: ScreenOrientation.Orientation } };
  handleRetakePhoto: () => void;
  handleConfirmPhoto: () => void;
}

const PhotoPreviewSection: React.FC<PhotoPreviewSectionProps> = ({
  photo,
  handleRetakePhoto,
  handleConfirmPhoto
}) => {
  const getLocationString = () => {
    if (photo.exif?.GPSLatitude && photo.exif?.GPSLongitude) {
      return `Lat: ${photo.exif.GPSLatitude.toFixed(6)}, Long: ${photo.exif.GPSLongitude.toFixed(6)}`;
    }
    return 'Location data not available';
  };

  const getImageStyle = () => {
    const { width, height } = Dimensions.get('window');
    const isPortrait = photo.exif?.Orientation === ScreenOrientation.Orientation.PORTRAIT_UP || 
                       photo.exif?.Orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN;
    return {
      width: isPortrait ? width : height,
      height: isPortrait ? height : width,
      resizeMode: 'contain' as 'contain',
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topNavigation}>
        <TouchableOpacity style={styles.navButton} onPress={handleRetakePhoto}>
          <Fontisto name='trash' size={24} color='white' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleConfirmPhoto}>
          <Fontisto name='check' size={24} color='white' />
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image
          style={[styles.previewImage, getImageStyle()]}
          source={{uri: 'data:image/jpg;base64,' + photo.base64}}
        />
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>{getLocationString()}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navButton: {
    padding: 20,
    marginTop: "20%"
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    flex: 1,
  },
  locationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  locationText: {
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
});

export default PhotoPreviewSection;

