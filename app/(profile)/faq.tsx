import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Undo2, ChevronDown, ChevronUp } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const FAQScreen = () => {
  const router = useRouter()
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null)

  const faqs = [
    {
      question: "1. How can i determine if my submission is valid for Return Service (RS)?",
      answer: "Your Return Service submission must meet the required criteria and documentation standards set by the CSO office."
    },
    {
      question: "2. How to contact CSO incase of emergency?",
      answer: "You can contact CSO through our emergency hotline or through the in-app support system."
    },
    {
      question: "3. How many RS should I comply per semester?",
      answer: "The required number of Return Service hours varies by scholarship level and program."
    },
    {
      question: "4. What am I going to do with my lacking RS?",
      answer: "If you have lacking RS hours, please contact the CSO office to discuss make-up options."
    },
    {
      question: "5. How to create account in scholarSerbisyo?",
      answer: "Follow the registration process in the app using your student credentials."
    },
    {
      question: "6. Terms and Conditions as a scholars",
      answer: "Review the complete terms and conditions in the scholarship agreement."
    },
    {
      question: "7. When will be the release of allowance?",
      answer: "Allowance release schedules are posted in the app and communicated through notifications."
    },
    {
      question: "8. How to submit RS evidence using offline mode?",
      answer: "The app provides an offline submission feature that syncs when internet connection is available."
    }
  ]

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Undo2 size={24} color="#191851" />
        </TouchableOpacity>
        <Text style={styles.title}>Frequently Asked{'\n'}Questions</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        {faqs.map((faq, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => toggleExpand(index)}
          >
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{faq.question}</Text>
              {expandedIndex === index ? (
                <ChevronUp size={24} color="white" />
              ) : (
                <ChevronDown size={24} color="white" />
              )}
            </View>
            {expandedIndex === index && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerText}>{faq.answer}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#191851',
    textAlign: 'center',
    lineHeight: 32,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  faqItem: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#191851',
  },
  questionText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    flex: 1,
    paddingRight: 16,
  },
  answerContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#191851',
  },
  answerText: {
    fontSize: 14,
    color: '#191851',
    lineHeight: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
})

export default FAQScreen

