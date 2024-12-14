import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { Text } from '../ui/text'
import { Comment } from '../types/comment'

interface CommentItemProps {
  comment: Comment
}

export function CommentItem({ comment }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')

  return (
    <View style={styles.container}>
      <View style={styles.commentHeader}>
        <Text style={styles.author}>{comment.author}</Text>
      </View>
      <Text style={styles.content}>{comment.content}</Text>
      
      <TouchableOpacity 
        style={styles.replyButton}
        onPress={() => setIsReplying(true)}
      >
        <Text style={styles.replyButtonText}>Reply</Text>
      </TouchableOpacity>

      {isReplying && (
        <View style={styles.replyContainer}>
          <TextInput
            style={styles.replyInput}
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Write a reply..."
            multiline
          />
          <View style={styles.replyActions}>
            <TouchableOpacity 
              style={styles.replyAction}
              onPress={() => {
                setIsReplying(false)
                setReplyText('')
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.replyAction, styles.saveButton]}
              onPress={() => {
                // Handle save reply
                setIsReplying(false)
                setReplyText('')
              }}
            >
              <Text style={styles.saveText}>Save comment</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {comment.replies?.map((reply, index) => (
        <View key={index} style={styles.replyItem}>
          <Text style={styles.replyAuthor}>{reply.author}</Text>
          <Text style={styles.replyContent}>{reply.content}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  commentHeader: {
    backgroundColor: '#343474',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  author: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  replyButton: {
    alignSelf: 'flex-start',
  },
  replyButtonText: {
    color: '#343474',
    fontSize: 14,
    fontWeight: '500',
  },
  replyContainer: {
    marginTop: 8,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 4,
    padding: 8,
    minHeight: 60,
    fontSize: 14,
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  replyAction: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  saveButton: {
    backgroundColor: '#343474',
  },
  cancelText: {
    color: '#666666',
    fontSize: 14,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  replyItem: {
    marginTop: 8,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#E5E5E5',
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#343474',
    marginBottom: 4,
  },
  replyContent: {
    fontSize: 14,
    color: '#666666',
  },
})

