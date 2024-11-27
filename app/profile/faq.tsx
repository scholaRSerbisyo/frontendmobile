import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.faqItem}>
      <Text style={styles.question}>{question}</Text>
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answer}>{answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const AboutUsScreen: React.FC = () => {
  const faqs = [
    {
      question: "How would I know if it is counted as RS?",
      answer: "RS is counted when you follow the official guidelines outlined by the scholarship program. Ensure you keep track of your RS activities.",
    },
    {
      question: "How to contact CSO in case of emergency?",
      answer: "You can contact the CSO through the official emergency contact number provided on the scholaRSerbisyo app or their website.",
    },
    {
      question: "How many RS should I comply per semester?",
      answer: "Typically, the required RS per semester varies, but make sure to consult the official RS guidelines to know the exact number.",
    },
    {
      question: "What am I going to do with my lacking RS?",
      answer: "For any lacking RS, reach out to the CSO to discuss options for making up the deficit before the semester ends.",
    },
    {
      question: "How to create an account in scholaRSerbisyo?",
      answer: "Creating an account in scholaRSerbisyo involves registering with your official email and filling out the required details on the registration page.",
    },
    {
      question: "Terms and Conditions as a scholar",
      answer: "The terms and conditions include maintaining good academic standing, completing the required RS, and adhering to the scholar code of conduct.",
    },
    {
      question: "When will the release of allowance be?",
      answer: "The release of allowances usually follows a set schedule. Keep an eye on official notifications for the exact release dates each semester.",
    },
    {
      question: "How to submit RS evidence using offline mode?",
      answer: "Use the scholaRSerbisyo app's offline mode to upload your RS evidence. It will sync when an internet connection is available.",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      <ScrollView style={styles.faqList}>
        {faqs.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5', // Background color from the image
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 25,
    color: '#191851z'
  },
  faqItem: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#EDEAE5',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  question: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
    textAlign: 'justify'
  },
  answerContainer: {
    marginTop: 10,
    paddingLeft: 10,
  },
  answer: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'justify'
  },
  faqList: {
    flex: 1, // Allow the ScrollView to fill available space
  },
});

export default AboutUsScreen;

