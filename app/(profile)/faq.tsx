import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Undo2, ChevronDown, ChevronUp } from 'lucide-react-native'

const FAQScreen = () => {
  const router = useRouter()
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null)

  const faqs = [
    {
      question: "What is Scholar Serbisyo?",
      answer: "Scholar Serbisyo is a mobile application designed to help scholars manage their scholarship-related activities, including return service schedules, benefits, and important announcements."
    },
    {
      question: "How do I apply for a scholarship?",
      answer: "To apply for a scholarship, you need to meet the eligibility criteria and submit an application through the City Scholarships Office. The app provides information about open applications and requirements."
    },
    {
      question: "What are the benefits of being a scholar?",
      answer: "Scholars receive free tuition and matriculation, a monthly stipend, and access to various development programs through the Iskolar Leaders Academy (ISLA)."
    },
    {
      question: "How do I schedule my return service?",
      answer: "You can view and manage your return service schedule through the Calendar feature in the app. If you need to make changes, please contact the scholarship office."
    },
    {
      question: "What should I do if I'm having technical issues with the app?",
      answer: "If you're experiencing technical issues, please try restarting the app or your device. If the problem persists, contact our support team through the Help section in the app."
    }
  ]

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Undo2 size={24} color="#191851" />
        </TouchableOpacity>
        <Text style={styles.title}>FAQ</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.questionContainer}
              onPress={() => toggleExpand(index)}
            >
              <Text style={styles.questionText}>{faq.question}</Text>
              {expandedIndex === index ? (
                <ChevronUp size={24} color="#191851" />
              ) : (
                <ChevronDown size={24} color="#191851" />
              )}
            </TouchableOpacity>
            {expandedIndex === index && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerText}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#191851',
    marginLeft: 16,
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FDB316',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#191851',
    flex: 1,
  },
  answerContainer: {
    padding: 15,
  },
  answerText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
  },
})

export default FAQScreen

