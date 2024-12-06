import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, SwitchCamera, X, Zap } from 'lucide-react-native';
import PhotoPreviewSection from './PhotoPreview';

interface CameraScreen2Props {
  navigation: {
    goBack: () => void;
  };
  onPhotoConfirm: (photo: string) => void;
}

export default function CameraScreen2({ navigation, onPhotoConfirm }: CameraScreen2Props) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleTorchToggle = () => {
    setIsTorchOn((current) => !current);
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takenPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takenPhoto);
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleConfirmPhoto = () => {
    if (photo && photo.base64) {
      onPhotoConfirm(photo.base64);
    }
    navigation.goBack();
  };

  if (photo) 
    return <PhotoPreviewSection 
      photo={photo} 
      handleRetakePhoto={handleRetakePhoto} 
      handleConfirmPhoto={handleConfirmPhoto}
    />;

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        enableTorch={isTorchOn}
        ref={cameraRef}
      >
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.controlButton} onPress={handleTorchToggle}>
            <Zap size={24} color={isTorchOn ? "#FFD700" : "white"} strokeWidth={3} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
            <SwitchCamera size={24} color="white" strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  permissionButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  permissionButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

