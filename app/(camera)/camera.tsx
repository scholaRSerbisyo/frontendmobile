import { useRouter } from 'expo-router'
import CameraScreen2 from '~/components/Camera/TorchExample'
import { CameraCapturedPicture } from 'expo-camera'

export default function Camera() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const handlePhotoConfirm = (photo: CameraCapturedPicture & { exif?: { GPSLatitude?: number; GPSLongitude?: number } }) => {
    // Here you can handle the confirmed photo, e.g., save it or pass it to another component
    console.log('Photo confirmed:', photo)
    // You might want to handle the GPS data here as well
    if (photo.exif?.GPSLatitude && photo.exif?.GPSLongitude) {
      console.log('GPS Location:', photo.exif.GPSLatitude, photo.exif.GPSLongitude)
    }
    router.back()
  }

  return (
    <CameraScreen2
      navigation={{
        goBack: handleGoBack
      }}
      onPhotoConfirm={handlePhotoConfirm}
    />
  )
}

