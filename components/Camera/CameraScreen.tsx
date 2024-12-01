

import PhotoPreviewSection from './PhotoPreview';
import { Camera } from 'lucide-react-native';
import { SwitchCamera } from 'lucide-react-native';
import { Flashlight } from 'lucide-react-native';
import { X } from 'lucide-react-native';
import { CameraType, CameraView, FlashMode, useCameraPermissions  } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('on');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function toggleCameraFlashing() {
    setFlash(current => {
      if (current === 'on') return 'off';
      if (current === 'off') return 'auto';
      if (current === 'auto') return 'on';
      return 'off'; // Fallback, though it shouldn't reach here
    });
  }

  const handleTakePhoto =  async () => {
    if (cameraRef.current) {
        const options = {
            quality: 1,
            base64: true,
            exif: false,
        };
        const takedPhoto = await cameraRef.current.takePictureAsync(options);

        setPhoto(takedPhoto);
    }
  }; 

  const handleRetakePhoto = () => setPhoto(null);

  if (photo) return <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto} />

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} 
      facing={facing}
      flash={flash}
      ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <SwitchCamera size={44} color='black' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <Camera size={44} color='black' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFlashing}>
            <Flashlight size={44} color='black' />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'gray',
    borderRadius: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

