import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { useRouter } from 'expo-router'
import { BottomNavigation } from '~/components/Navigation/BottomNavigation'

interface InfoFieldProps {
  label: string
  value: string
  isLast?: boolean
}

const InfoField = ({ label, value, isLast }: InfoFieldProps) => (
  <View style={[styles.fieldContainer, isLast && styles.lastFieldContainer]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value}</Text>
    <View style={styles.fieldBorder} />
  </View>
)

const ScholarsInfoScreen = () => {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scholar's Info</Text>
        </View>

        <ScrollView style={styles.content}>
          <InfoField 
            label="First Name" 
            value="Month/Day/Year"
          />
          <InfoField 
            label="Last Name" 
            value="20 years old"
          />
          <InfoField 
            label="Birthdate" 
            value="Month/Day/Year"
          />
          <InfoField 
            label="Age" 
            value="20 years old"
          />
          <InfoField 
            label="Mobile Number" 
            value="09********"
          />
          <InfoField 
            label="Gender" 
            value="Female"
          />
          <InfoField 
            label="Course" 
            value="BS in Information Technology"
          />
          <InfoField 
            label="Year Level" 
            value="3rd year"
          />
          <InfoField 
            label="School" 
            value="University of Science and Technology in Southern Philippines- CDO"
          />
          <InfoField 
            label="Barangay" 
            value="Zone 2 Carmen, Cagayan de Oro City"
            isLast
          />
        </ScrollView>
        <BottomNavigation />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343474',
  },
  header: {
    backgroundColor: '#343474',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: '10%',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  backText: {
    fontSize: 18,
    color: '#F3BC00',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  lastFieldContainer: {
    marginBottom: 80,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#F3BC00',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  fieldBorder: {
    height: 1,
    backgroundColor: '#000000',
    opacity: 0.1,
  },
})

export default ScholarsInfoScreen


// import React, { useState, useEffect } from 'react'
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
// import { useRouter } from 'expo-router'
// import { BottomNavigation } from '~/components/Navigation/BottomNavigation'

// interface ScholarInfo {
//   firstName: string
//   lastName: string
//   birthdate: string
//   age: string
//   mobileNumber: string
//   gender: string
//   course: string
//   yearLevel: string
//   school: string
//   barangay: string
// }

// interface InfoFieldProps {
//   label: string
//   value: string
//   isLast?: boolean
// }

// const InfoField = ({ label, value, isLast }: InfoFieldProps) => (
//   <View style={[styles.fieldContainer, isLast && styles.lastFieldContainer]}>
//     <Text style={styles.fieldLabel}>{label}</Text>
//     <Text style={styles.fieldValue}>{value}</Text>
//     <View style={styles.fieldBorder} />
//   </View>
// )

// const ScholarsInfoScreen = () => {
//   const router = useRouter()
//   const [scholarInfo, setScholarInfo] = useState<ScholarInfo | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     fetchScholarInfo()
//   }, [])

//   const fetchScholarInfo = async () => {
//     try {
//       setIsLoading(true)
//       // Replace 'YOUR_API_ENDPOINT' with the actual endpoint of your backend
//       const response = await fetch('YOUR_API_ENDPOINT')
//       if (!response.ok) {
//         throw new Error('Failed to fetch scholar info')
//       }
//       const data: ScholarInfo = await response.json()
//       setScholarInfo(data)
//       setIsLoading(false)
//     } catch (err) {
//       setError('Error fetching scholar info. Please try again later.')
//       setIsLoading(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#F3BC00" />
//         </View>
//       </SafeAreaView>
//     )
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       </SafeAreaView>
//     )
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={{ flex: 1 }}>
//         <View style={styles.header}>
//           <TouchableOpacity 
//             onPress={() => router.back()}
//             style={styles.backButton}
//           >
//             <Text style={styles.backText}>Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Scholar's Info</Text>
//         </View>

//         <ScrollView style={styles.content}>
//           {scholarInfo && (
//             <>
//               <InfoField label="First Name" value={scholarInfo.firstName} />
//               <InfoField label="Last Name" value={scholarInfo.lastName} />
//               <InfoField label="Birthdate" value={scholarInfo.birthdate} />
//               <InfoField label="Age" value={scholarInfo.age} />
//               <InfoField label="Mobile Number" value={scholarInfo.mobileNumber} />
//               <InfoField label="Gender" value={scholarInfo.gender} />
//               <InfoField label="Course" value={scholarInfo.course} />
//               <InfoField label="Year Level" value={scholarInfo.yearLevel} />
//               <InfoField label="School" value={scholarInfo.school} />
//               <InfoField label="Barangay" value={scholarInfo.barangay} isLast />
//             </>
//           )}
//         </ScrollView>
//         <BottomNavigation />
//       </View>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#343474',
//   },
//   header: {
//     backgroundColor: '#343474',
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//     marginTop: '10%',
//   },
//   backButton: {
//     position: 'absolute',
//     left: 20,
//     zIndex: 1,
//   },
//   backText: {
//     fontSize: 18,
//     color: '#F3BC00',
//     fontWeight: '600',
//   },
//   headerTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     textAlign: 'center',
//   },
//   content: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 100,
//   },
//   fieldContainer: {
//     marginBottom: 20,
//   },
//   fieldLabel: {
//     fontSize: 16,
//     color: '#F3BC00',
//     marginBottom: 8,
//   },
//   fieldValue: {
//     fontSize: 16,
//     color: '#000000',
//     marginBottom: 8,
//   },
//   fieldBorder: {
//     height: 1,
//     backgroundColor: '#000000',
//     opacity: 0.1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     color: '#FFFFFF',
//     textAlign: 'center',
//   },
//   lastFieldContainer: {
//     marginBottom: 80,
//   },
// })

// export default ScholarsInfoScreen


