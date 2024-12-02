import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../ui/text';

interface ProfilePostProps {
  post: {
    title: string;
    date: string;
    location: string;
    type: string;
    description: string;
    images: string[];
  };
}

export function ProfilePost({ post }: ProfilePostProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.postCard}>
        <Text style={styles.postTitle}>{post.title}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{post.date}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{post.location}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Type of RS:</Text>
          <Text style={styles.value}>{post.type}</Text>
        </View>
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.description}>{post.description}</Text>
        </View>

        <View style={styles.imagesContainer}>
          {post.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#191851',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#191851',
    fontWeight: '500',
    marginRight: 8,
    width: 80,
  },
  value: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    lineHeight: 20,
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  postImage: {
    flex: 1,
    height: 150,
    borderRadius: 8,
  },
});

