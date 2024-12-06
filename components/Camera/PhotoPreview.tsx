import React from 'react';
import { Fontisto } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View } from 'react-native';

interface PhotoPreviewSectionProps {
  photo: CameraCapturedPicture;
  handleRetakePhoto: () => void;
  handleConfirmPhoto: () => void;
}

const PhotoPreviewSection: React.FC<PhotoPreviewSectionProps> = ({
  photo,
  handleRetakePhoto,
  handleConfirmPhoto
}) => (
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
        style={styles.previewImage}
        source={{uri: 'data:image/jpg;base64,' + photo.base64}}
      />
    </View>
  </SafeAreaView>
);

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
    paddingHorizontal: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    resizeMode: 'contain',
  },
});

export default PhotoPreviewSection;

