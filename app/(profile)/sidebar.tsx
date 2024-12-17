import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Text } from '~/components/ui/text'
import { Menu } from 'lucide-react-native'
import { SideMenu } from '~/components/Profile/Sidebar/SideMenu'

export default function TestScreen() {
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false)

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => setIsSideMenuVisible(true)}
        style={styles.menuButton}
      >
        <Menu color="#343474" size={24} />
      </TouchableOpacity>

      <SideMenu 
        isVisible={isSideMenuVisible}
        onClose={() => setIsSideMenuVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  menuButton: {
    padding: 20,
  },
})

