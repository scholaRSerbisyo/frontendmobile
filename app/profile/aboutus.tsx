import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutUsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <ScrollView style={styles.contentContainer}>
        {/* About Us Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>About Us</Text>
          <View style={styles.sectionContentContainer}>
            <Text style={styles.sectionContent}>
              As part of the administration's RISE agenda to improve human development through access to quality education, the City Scholarships Office offers tertiary education scholarship grants to poor but deserving students of Cagayan de Oro.
            </Text>
          </View>
        </View>

        {/* Vision Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Vision</Text>
          <View style={styles.sectionContentContainer}>
            <Text style={styles.sectionContent}>
              A premiere Scholarship program in the country dedicated to producing scholar-leaders that are grounded, skilled, and catalysts of change in their communities.
            </Text>
          </View>
        </View>

        {/* Mission Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Mission</Text>
          <View style={styles.sectionContentContainer}>
            <Text style={styles.sectionContent}>
              The City Scholarships Office seeks to empower young Kagay-anons by providing scholarships to deserving students who aim to finish tertiary education.
              
              {'\n\n'}As a Youth Formation arm, CSO aims to sustain students from admission to graduation through Academic Enhancement Programs, Leadership Development, and Ladderized Formation. It seeks to form and educate next-generation leaders of the City.
              
              {'\n\n'}To help alleviate poverty, CSO prepares scholars for employment and income-generating opportunities through Enrolment to Placement sessions. CSO also partners with local employers and institutions to accommodate alumni scholars for local employment.
            </Text>
          </View>
        </View>

        {/* Benefits Section */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#191851', // Dark blue color
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#191851', // Dark blue border color
    marginBottom: 15,

  },
  sectionHeader: {
    backgroundColor: '#FDB316', // Yellow header background
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000', // Black text color for the header
    textAlign: 'center',
  },
  sectionContentContainer: {
    padding: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
    textAlign: 'justify'
  },
});

export default AboutUsScreen;
