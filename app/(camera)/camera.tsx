import { useRouter } from 'expo-router'
import CameraScreen2 from '~/components/Camera/TorchExample'

export default function Camera() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  const handlePhotoConfirm = (photo: string) => {
    // Here you can handle the confirmed photo, e.g., save it or pass it to another component
    console.log('Photo confirmed:', photo)
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

