import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LogoutConfirm } from '~/components/Authentication/LogoutConfirm'

export default function LogoutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require('~/assets/images/2nd-type-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.bottomSection}>
        <LogoutConfirm />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: '100%',
    height: 100,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#343474',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  }
}
)


// import React from 'react';
// import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter } from 'expo-router';
// import { Text } from '~/components/ui/text';
// import { useAuth } from '~/components/Authentication/api/Auth';

// export default function LogoutScreen() {
//   const router = useRouter();
//   const { signOut } = useAuth();

//   const handleLogout = async () => {
//     try {
//       await signOut();
//       router.replace('/(authentication)/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <Image
//           source={require('../../assets/images/2nd-type-logo.png')}
//           style={styles.logo}
//           resizeMode="contain"
//         />
        
//         <View style={styles.formContainer}>
//           <Text style={styles.title}>Log Out</Text>
//           <Text style={styles.message}>
//             Are you sure that you want to log out?
//           </Text>

//           <TouchableOpacity 
//             style={styles.continueButton}
//             onPress={handleLogout}
//           >
//             <Text style={styles.continueButtonText}>Continue</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.continueButton, styles.cancelButton]}
//             onPress={() => router.back()}
//           >
//             <Text style={styles.continueButtonText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#343474',
//   },
//   content: {
//     flex: 1,
//     alignItems: 'center',
//     paddingHorizontal: 24,
//   },
//   logo: {
//     width: 280,
//     height: 100,
//     marginBottom: 40,
//   },
//   formContainer: {
//     flex: 1,
//     width: '100%',
//     justifyContent: 'flex-start',
//     paddingTop: 60,
//   },
//   title: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 24,
//     textAlign: 'center',
//   },
//   message: {
//     fontSize: 16,
//     color: 'white',
//     marginBottom: 40,
//     textAlign: 'center',
//   },
//   continueButton: {
//     backgroundColor: '#FDB316',
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   cancelButton: {
//     backgroundColor: '#FDB316',
//     marginTop: 16,
//   },
//   continueButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

