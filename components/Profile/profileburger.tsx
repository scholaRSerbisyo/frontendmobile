import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '~/components/ui/text'
import { ChevronLeft, X } from 'lucide-react-native'
import { Link } from 'expo-router'

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <ChevronLeft color="white" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={require('../../assets/images/final-logo-iskoserbisyo.png')}
            style={styles.profileImage}
          />
          <Text style={styles.name}>Shera Nacaitona</Text>
          <Text style={styles.status}>Student at URP Cagayan de Oro</Text>
        </View>

        <View style={styles.menuSection}>
          
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
          

          <Link href="/(profile)/faq" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>FAQ</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(calendar)/calendar" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Calendar</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(profile)/logout" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Log Out</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343474',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#F3BC00',
    marginBottom: 20,
  },
  menuSection: {
    padding: 16,
  },
  menuItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F3BC00',
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#343474',
    textAlign: 'center',
  },
})