import React from 'react'
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  Animated, 
  Dimensions 
} from 'react-native'
import { useRouter } from 'expo-router'
import { X } from 'lucide-react-native'
import { Text } from '~/components/ui/text'
import * as SecureStore from 'expo-secure-store'

interface SideMenuProps {
  isVisible: boolean
  onClose: () => void
}

const menuItems = [
  {
    title: "Scholar's Info",
    route: '/edit-profile'
  },
  {
    title: "About CSO",
    route: '/(profile)/aboutus'
  },
  {
    title: "FAQ",
    route: '/(profile)/faq'
  },
  {
    title: "Calendar",
    route: '/(calendar)/calendar'
  },
  {
    title: "Log Out",
    route: '/(profile)/logout'
  }
]

const { width } = Dimensions.get('window')

export function SideMenu({ isVisible, onClose }: SideMenuProps) {
  const router = useRouter()
  const slideAnim = React.useRef(new Animated.Value(width)).current

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } 
    else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [isVisible])

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('authToken')
    router.replace('/login')
  }

  const handleMenuItemPress = (route: string, title: string) => {
    if (title === 'Log Out') {
      handleLogout()
    } else {
      router.push(route)
    }
    onClose()
  }

  if (!isVisible) return null

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View 
          style={[
            styles.menu,
            {
              transform: [{ translateX: slideAnim }]
            }
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <X color="#F3BC00" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuItems}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item.route, item.title)}
              >
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    width: 300,
    backgroundColor: 'white',
    height: '100%',
    position: 'absolute',
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  menuItems: {
    padding: 20,
    gap: 16,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 5,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: 'black',
  },
  menuItemText: {
    color: '#F3BC00',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: '5%'
  },
})

