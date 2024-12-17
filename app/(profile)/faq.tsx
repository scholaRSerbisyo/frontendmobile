import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { useRouter } from 'expo-router'
import { ChevronDown, ChevronUp } from 'lucide-react-native'
import { BottomNavigation } from '~/components/Navigation/BottomNavigation'

interface FAQItemProps {
  question: string
  answer: string
  isExpanded: boolean
  onPress: () => void
}

const FAQItem = ({ question, answer, isExpanded, onPress }: { question: string; answer: string; isExpanded: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.faqItem}>
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{question}</Text>
      {isExpanded ? (
        <ChevronUp size={24} color="#000000" />
      ) : (
        <ChevronDown size={24} color="#000000" />
      )}
    </View>
    {isExpanded && (
      <View style={styles.answerContainer}>
        <Text style={styles.answerText}>{answer}</Text>
      </View>
    )}
  </TouchableOpacity>
)

const FAQScreen = () => {
  const router = useRouter()

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null)

  const faqs = [
    {
      question: "1. How can I determine if my submission is valid for Return Service (RS)?",
      answer: "To determine if your submission is valid for Return Service (RS) as a scholar, make sure you have submitted the required proof, such as a clear photo of the necessary documents or items. Check if your submission is marked as \"completed\". If your submission is declined by the CSO, you will be notified through the ScholarSerbisyo mobile app. Ensure that the photo you provide meets all requirements and is not deemed invalid."
    },
    {
      question: "2. How to contact CSO incase of emergency?",
      answer: "In the event of an emergency, you have several options to contact the City Social Office (CSO). For quick access to their contact information, open the mobile app and navigate to the settings section. There, you'll find a phone number for immediate assistance, an email address for less urgent inquiries, and a link to their Facebook page for updates and general information. If you prefer face-to-face communication or need to submit documents in person, you can visit their physical location at City Hall Hayes in Cagayan De Oro. These multiple channels ensure that you can reach out to the CSO through the method most convenient for you, depending on the urgency and nature of your situation."
    },
    {
      question: "3. How many RS should I comply per semester?",
      answer: "You should comply with 5 RS (return service for scholar) per semester. This requirement is part of your academic responsibilities. It's important to keep track of these obligations and complete them in a timely manner. Remember to plan ahead and manage your time effectively to accommodate these RS requirements alongside your regular coursework and other activities."
    },
    {
      question: "4. What am I going to do with my lacking RS?",
      answer: "To address your lacking RS, you should regularly check the mobile app for available opportunities. Visit the CSO to inquire about additional ways to fulfill your RS requirements. Don't hesitate to reach out to your scholarship office for guidance. By staying proactive and consistently seeking out opportunities, you'll be better positioned to meet your RS requirements and avoid falling behind."
    },
    {
      question: "5. How to create account in scholaRSerbisyo?",
      answer: "Creating an account in scholaRSerbisyo is a straightforward process that can be completed using your mobile device. Follow these steps to set up your account and gain access to the scholaRSerbisyo services:\n\nStep 1: Download the scholaRSerbisyo app from your device's app store.\nStep 2: Open the app on your smartphone.\nStep 3: Look for the registration option on the initial screen.\nStep 4: Tap the registration button to start the process.\nStep 5: Provide the required personal information, including your name and birthday.\nStep 6: Create a password for your account.\nStep 7: Follow the on-screen prompts to complete each step of the registration.\nStep 8: Submit your information."
    },
    {
      question: "6. Terms and Conditions as a scholar",
      answer: "As a scholar, you are bound by certain terms and conditions that govern your academic journey and responsibilities. These typically include maintaining a specified minimum grade point average (GPA) to retain your scholarship, enrolling in a full-time course load each semester, and making satisfactory progress towards your degree. You may be required to participate in specific academic programs, mentoring activities, or community service initiatives as part of your scholarship obligations. Financial aspects often include restrictions on receiving additional scholarships or financial aid, and guidelines for how scholarship funds can be used. Ethical conduct is usually emphasized, with expectations to adhere to the institution's code of conduct and academic integrity policies. It's crucial to carefully review and understand all terms and conditions associated with your specific scholarship, as failure to comply could result in the loss of financial support or other consequences."
    },
    {
      question: "7. When will be the release of allowance?",
      answer: "The release of allowance typically follows a scheduled timeline set by the scholarship program. Contact the CSO office for specific dates and requirements for allowance release. Make sure to complete all necessary documentation and meet academic requirements to ensure timely release of your allowance."
    },
    {
      question: "8. How to submit RS evidence using offline mode?",
      answer: "Submitting RS evidence using offline mode is a process that can be completed through the scholaRSerbisyo mobile app, even without an internet connection. Here are the steps:\n\n1. Ensure you have internet connectivity and log in to the scholaRSerbisyo mobile app.\n2. Navigate to the capture section of the app while still online.\n3. Once logged in and in the capture section, you can now go to your RS location, even without internet.\n4. At your RS location, open the app and select the \"Offline Mode\" option.\n5. Use the app to capture a \"Time In\" photo when you arrive.\n6. Allow the app to automatically recognize the location and time.\n7. Perform your RS duties as required.\n8. When you finish your RS, use the app to capture a \"Time Out\" photo.\n9. Again, allow the app to automatically recognize the location and time.\n10. Review the captured information for accuracy.\n11. Save the evidence in the app for later submission.\n12. Once you're back online, sync your app to upload the saved RS evidence."
    }
  ]

  const handleFAQPress = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

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
          <Text style={styles.headerTitle}>FAQs</Text>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isExpanded={expandedIndex === index}
              onPress={() => handleFAQPress(index)}
            />
          ))}
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
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20, 
  },
  faqItem: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000000',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
    marginRight: 16,
    fontWeight: 'bold',
    textAlign: 'justify'

  },
  answerContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#000000',
  },
  answerText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    textAlign: 'justify',
  },
})

export default FAQScreen









// import React from 'react'
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
// import { useRouter } from 'expo-router'
// import { ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { BottomNavigation } from '~/components/Navigation/BottomNavigation'
// const FAQScreen = () => {
//   const router = useRouter()
//   const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null)

//   const faqs = [
//     {
//       question: "1. How can I determine if my submission is valid for Return Service (RS)?",
//       answer: "To determine if your submission is valid for Return Service (RS) as a scholar, make sure you have submitted the required proof, such as a clear photo of the necessary documents or items. Check if your submission is marked as \"completed\". If your submission is declined by the CSO, you will be notified through the ScholarSerbisyo mobile app. Ensure that the photo you provide meets all requirements and is not deemed invalid."
//     },
//     {
//       question: "2. How to contact CSO incase of emergency?",
//       answer: "In the event of an emergency, you have several options to contact the City Social Office (CSO). For quick access to their contact information, open the mobile app and navigate to the settings section. There, you'll find a phone number for immediate assistance, an email address for less urgent inquiries, and a link to their Facebook page for updates and general information. If you prefer face-to-face communication or need to submit documents in person, you can visit their physical location at City Hall Hayes in Cagayan De Oro. These multiple channels ensure that you can reach out to the CSO through the method most convenient for you, depending on the urgency and nature of your situation."
//     },
//     {
//       question: "3. How many RS should I comply per semester?",
//       answer: "You should comply with 5 RS (return service for scholar) per semester. This requirement is part of your academic responsibilities. It's important to keep track of these obligations and complete them in a timely manner. Remember to plan ahead and manage your time effectively to accommodate these RS requirements alongside your regular coursework and other activities."
//     },
//     {
//       question: "4. What am I going to do with my lacking RS?",
//       answer: "To address your lacking RS, you should regularly check the mobile app for available opportunities. Visit the CSO to inquire about additional ways to fulfill your RS requirements. Don't hesitate to reach out to your scholarship office for guidance. By staying proactive and consistently seeking out opportunities, you'll be better positioned to meet your RS requirements and avoid falling behind."
//     },
//     {
//       question: "5. How to create account in scholaRSerbisyo?",
//       answer: "Creating an account in scholaRSerbisyo is a straightforward process that can be completed using your mobile device. Follow these steps to set up your account and gain access to the scholaRSerbisyo services:\n\nStep 1: Download the scholaRSerbisyo app from your device's app store.\nStep 2: Open the app on your smartphone.\nStep 3: Look for the registration option on the initial screen.\nStep 4: Tap the registration button to start the process.\nStep 5: Provide the required personal information, including your name and birthday.\nStep 6: Create a password for your account.\nStep 7: Follow the on-screen prompts to complete each step of the registration.\nStep 8: Submit your information."
//     },
//     {
//       question: "6. Terms and Conditions as a scholar",
//       answer: "As a scholar, you are bound by certain terms and conditions that govern your academic journey and responsibilities. These typically include maintaining a specified minimum grade point average (GPA) to retain your scholarship, enrolling in a full-time course load each semester, and making satisfactory progress towards your degree. You may be required to participate in specific academic programs, mentoring activities, or community service initiatives as part of your scholarship obligations. Financial aspects often include restrictions on receiving additional scholarships or financial aid, and guidelines for how scholarship funds can be used. Ethical conduct is usually emphasized, with expectations to adhere to the institution's code of conduct and academic integrity policies. It's crucial to carefully review and understand all terms and conditions associated with your specific scholarship, as failure to comply could result in the loss of financial support or other consequences."
//     },
//     {
//       question: "7. How to submit RS evidence using offline mode?",
//       answer: "Submitting RS evidence using offline mode is a process that can be completed through the scholaRSerbisyo mobile app, even without an internet connection. Here are the steps:\n\n1. Ensure you have internet connectivity and log in to the scholaRSerbisyo mobile app.\n2. Navigate to the capture section of the app while still online.\n3. Once logged in and in the capture section, you can now go to your RS location, even without internet.\n4. At your RS location, open the app and select the \"Offline Mode\" option.\n5. Use the app to capture a \"Time In\" photo when you arrive.\n6. Allow the app to automatically recognize the location and time.\n7. Perform your RS duties as required.\n8. When you finish your RS, use the app to capture a \"Time Out\" photo.\n9. Again, allow the app to automatically recognize the location and time.\n10. Review the captured information for accuracy.\n11. Save the evidence in the app for later submission.\n12. Once you're back online, sync your app to upload the saved RS evidence."
//     }
//   ]

//   const toggleExpand = (index: number) => {
//     setExpandedIndex(expandedIndex === index ? null : index)
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={{ flex: 1 }}>
//         <View style={styles.headerContainer}>
//           <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Text style={styles.backButtonText}>Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.title}>Frequently Asked{'\n'}Questions</Text>
//         </View>

//         <ScrollView style={styles.contentContainer}>
//           {faqs.map((faq, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.faqItem}
//               onPress={() => toggleExpand(index)}
//             >
//               <View style={styles.questionContainer}>
//                 <Text style={styles.questionText}>{faq.question}</Text>
//                 {expandedIndex === index ? (
//                   <ChevronUp size={24} color="white" />
//                 ) : (
//                   <ChevronDown size={24} color="white" />
//                 )}
//               </View>
//               {expandedIndex === index && (
//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{faq.answer}</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//         <BottomNavigation />
//       </View>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   headerContainer: {
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     position: 'relative',
//   },
//   title: {
//     fontSize: 28, // Increased from 24
//     fontWeight: 'bold',
//     color: '#343474',
//     textAlign: 'center',
//     lineHeight: 36, // Adjusted to accommodate larger font size
//   },
//   contentContainer: {
//     paddingHorizontal: 20,
//     paddingTop: 10,
//     paddingBottom: 60, // Add padding to prevent content from being hidden behind BottomNavigation
//   },
//   faqItem: {
//     marginBottom: 10,
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   questionContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#343474',
//   },
//   questionText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: 'white',
//     flex: 1,
//     paddingRight: 16,
//   },
//   answerContainer: {
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderTopWidth: 0,
//     borderColor: '#343474',
//   },
//   answerText: {
//     fontSize: 14,
//     color: '#343474',
//     lineHeight: 20,
//     textAlign: 'justify',
//   },
//   backButton: {
//     position: 'absolute',
//     left: 20,
//     top: 20,
//     zIndex: 1,
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: '#F3BC00',
//     fontWeight: '600',
//   },
// })

// export default FAQScreen

