import React from 'react'
import { View, Image, ScrollView, StyleSheet } from 'react-native'
import { Text } from '~/components/ui/text'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card } from '~/components/ui/card'

export default function ContentScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.backButton}>←</Text>
        <Text style={styles.headerTitle}>Content</Text>
      </View>

      <Card style={styles.contentCard}>
        <Image
          source={require('../../assets/images/2nd-type-logo.png')}
          style={styles.groupPhoto}
          resizeMode="cover"
        />
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Post Title Here</Text>
          <Input placeholder="Date" style={styles.input} />
          <Input placeholder="Time" style={styles.input} />
          <Input placeholder="Location" style={styles.input} />
          <Input placeholder="Type of Event" style={styles.input} />
          <Input
            placeholder="Description"
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
          <Button style={styles.attachButton}>
            <Text style={styles.attachButtonText}>Attach File</Text>
          </Button>
        </View>
      </Card>

      <Card style={styles.commentsCard}>
        <Text style={styles.commentsHeader}>All comments</Text>
        <View style={styles.commentItem}>
          <Text style={styles.commentName}>Scholar's Name</Text>
          <Text style={styles.commentText}>scholar's concern</Text>
          <View style={styles.replyContainer}>
            <Text style={styles.replyName}>Coordinator's Name</Text>
            <Text style={styles.replyText}>coordinator's reply</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    fontSize: 24,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentCard: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  groupPhoto: {
    width: '100%',
    height: 200,
  },
  formContainer: {
    padding: 16,
  },
  formLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    height: 40,
  },
  textArea: {
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    height: 100,
    textAlignVertical: 'top',
  },
  attachButton: {
    backgroundColor: '#FDB316',
    borderRadius: 8,
  },
  attachButtonText: {
    color: '#191851',
    fontWeight: 'bold',
  },
  commentsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  commentsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  commentItem: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  commentName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentText: {
    marginBottom: 8,
  },
  replyContainer: {
    backgroundColor: '#E0E0E0',
    padding: 12,
    borderRadius: 8,
    marginLeft: 16,
  },
  replyName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  replyText: {
    color: '#666',
  },
})