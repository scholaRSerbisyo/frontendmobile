import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '../ui/text';
import { ProfilePost } from './ProfilePost';
import { Submission } from '../types/submission';
import { format, parseISO, isAfter, isBefore, isEqual } from 'date-fns';

interface ProfilePostsProps {
  submissions: Submission[];
}

export function ProfilePosts({ submissions }: ProfilePostsProps) {
  const [sortedSubmissions, setSortedSubmissions] = useState<Submission[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  useEffect(() => {
    sortAndFilterSubmissions();
  }, [submissions, sortOrder, filterDate]);

  const sortAndFilterSubmissions = () => {
    let filtered = [...submissions];

    // Apply date filter if set
    if (filterDate) {
      filtered = filtered.filter(submission => {
        const submissionDate = parseISO(submission.event.date);
        return isEqual(submissionDate, filterDate);
      });
    }

    // Sort submissions
    const sorted = filtered.sort((a, b) => {
      const dateA = parseISO(a.event.date);
      const dateB = parseISO(b.event.date);
      if (sortOrder === 'asc') {
        return isAfter(dateA, dateB) ? 1 : -1;
      } else {
        return isBefore(dateA, dateB) ? 1 : -1;
      }
    });

    setSortedSubmissions(sorted);
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDateFilter = (date: Date | null) => {
    setFilterDate(date);
  };

  const renderItem = ({ item }: { item: Submission }) => (
    <ProfilePost submission={item} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
          <Text style={styles.buttonText}>
            Sort {sortOrder === 'asc' ? '↑' : '↓'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDateFilter(null)} style={styles.filterButton}>
          <Text style={styles.buttonText}>
            Clear Filter
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedSubmissions}
        renderItem={renderItem}
        keyExtractor={(item) => item.submission_id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  sortButton: {
    backgroundColor: '#343474',
    padding: 8,
    borderRadius: 4,
  },
  filterButton: {
    backgroundColor: '#F3BC00',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 16,
  },
});

