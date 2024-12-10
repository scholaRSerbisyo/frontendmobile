import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Dimensions } from 'react-native';
import { CameraCapturedPicture, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, SwitchCamera, X, Zap } from 'lucide-react-native';
import PhotoPreviewSection from './PhotoPreview';
import * as Location from 'expo-location';
import * as ScreenOrientation from 'expo-screen-orientation';

interface CameraScreen2Props {
  navigation: {
    goBack: () => void;
  };
  onPhotoConfirm: (photo: CameraCapturedPicture & { exif?: { GPSLatitude?: number; GPSLongitude?: number } }) => void;
}

export default function CameraScreen2({ navigation, onPhotoConfirm }: CameraScreen2Props) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation>(ScreenOrientation.Orientation.PORTRAIT_UP);
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);

      // Set up orientation change listener
      ScreenOrientation.addOrientationChangeListener(handleOrientationChange);
      // Get initial orientation
      const initialOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(initialOrientation);
    })();

    // Cleanup
    return () => {
      ScreenOrientation.removeOrientationChangeListeners();
    };
  }, []);

  const handleOrientationChange = (event: ScreenOrientation.OrientationChangeEvent) => {
    setOrientation(event.orientationInfo.orientation);
  };

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
        exif: true,
      };
      const takenPhoto = await cameraRef.current.takePictureAsync(options);
      if (takenPhoto) {
        setPhoto({
          ...takenPhoto,
          exif: {
            ...takenPhoto.exif,
            GPSLatitude: currentLocation?.coords.latitude,
            GPSLongitude: currentLocation?.coords.longitude,
            Orientation: orientation,
          },
        });
      }
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleConfirmPhoto = () => {
    if (photo) {
      onPhotoConfirm(photo);
    }
    navigation.goBack();
  };

  const getCameraStyle = () => {
    const { width, height } = Dimensions.get('window');
    const isPortrait = orientation === ScreenOrientation.Orientation.PORTRAIT_UP || 
                       orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN;
    return {
      width: isPortrait ? width : height,
      height: isPortrait ? height : width,
    };
  };

  if (photo) 
    return <PhotoPreviewSection 
      photo={photo} 
      handleRetakePhoto={handleRetakePhoto} 
      handleConfirmPhoto={handleConfirmPhoto}
    />;

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={[styles.camera, getCameraStyle()]}
        facing={facing}
        enableTorch={isTorchOn}
        ref={cameraRef}
      >
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={36} color="#FFD700" />
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
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>{currentLocation ? `${currentLocation?.coords.latitude.toFixed(6)}, ${currentLocation?.coords.longitude.toFixed(6)}` : 'Location not available'}</Text>
        </View>
      </CameraView>
    </SafeAreaView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    marginTop: '16%',
    marginLeft: '8%',
    zIndex: 16,
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
  locationContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  locationText: {
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
});

