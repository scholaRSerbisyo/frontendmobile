import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { BottomNavigation } from '~/components/Navigation/BottomNavigation'
const AboutUsScreen = () => {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.topSection}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.undoButton}
          >
            <ChevronLeft size={24} color="#191851" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.mainTitle}>Settings</Text>

        <ScrollView style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>About Us</Text>
            <View style={styles.sectionContentContainer}>
              <Text style={styles.sectionContent}>
                As part of the administration's RISE agenda to improve human development through access to quality education, the City Scholarships Office offers tertiary education scholarship grants to poor but deserving students of Cagayan de Oro.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Vision</Text>
            <View style={styles.sectionContentContainer}>
              <Text style={styles.sectionContent}>
                A premiere Scholarship program in the country dedicated to producing scholar-leaders that are grounded, skilled, and catalysts of change in their communities.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Mission</Text>
            <View style={styles.sectionContentContainer}>
              <Text style={styles.sectionContent}>
                The City Scholarships Office seeks to empower young Kagay-anons by providing scholarships to deserving students who aim to finish tertiary education.
                
                {'\n\n'}As a Youth Formation arm, CSO aims to sustain students from admission to graduation through Academic Enhancement Programs, Leadership Development and Ladderized Formation. It seeks to form and educate next-generation leaders of the City.
                
                {'\n\n'}To help alleviate poverty, CSO prepares scholars for employment and income-generating opportunities through Enrolment to Placement sessions. CSO also partners with local employers and institutions to accommodate alumni scholars for local employment.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>The Benefits</Text>
            <View style={styles.sectionContentContainer}>
              <Text style={styles.sectionContent}>
                All scholars enjoy the privilege of free tuition and matriculation, and a monthly stipend. Also, scholars will go through four (4) formation levels under the Iskolar Leaders Academy (ISLA). The Academy is designed to cater to year-level appropriate interventions to help sustain students in the program. 
                
                {'\n\n'}First Year: Module S: Self- Discover 
                
                {'\n'}This is to allow students to discover more of their inner potentials and enable them to make a self-concept of how they want to be in the future. 
                
                {'\n\n'}Second Year: Module L: Leadership 
                
                {'\n'}With the believe that every scholar is a leader, this module aims to form young men and women to be future leaders in the City 
                
                {'\n\n'}Third Year: Module C: Community Engagement 
                
                {'\n'}This is designed to broaden the horizon of our scholars by making them see realities and propose solutions in the lens of their course of study in school. 
                
                {'\n\n'}Fourth Year: Module N: Nation-Building 
                
                {'\n'}Now in their fourth year, scholars are equipped with skills necessary for them to be employable at work. This is also to build patriotism and nationalism with the hope to pay forward and become catalysts of change
              </Text>
            </View>
          </View>
        </ScrollView>
        <BottomNavigation />
      </View>
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topSection: {
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  undoButton: {
    padding: 8,
  },
  mainTitle: {
    fontSize: 32,
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
    color: '#191851',
    textAlign: 'center',
    marginVertical: 10,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 15,
    overflow: 'hidden',
  },
  sectionHeader: {
    backgroundColor: '#FDB316',
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 24,
    fontFamily: 'Times New Roman',
    color: '#000000',
    textAlign: 'center',
  },
  sectionContentContainer: {
    padding: 15,
  },
  sectionContent: {
    fontSize: 16,
    fontFamily: 'Times New Roman',
    color: '#000000',
    lineHeight: 24,
    textAlign: 'justify',
  },
})

export default AboutUsScreen

