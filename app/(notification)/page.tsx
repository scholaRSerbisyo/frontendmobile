import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, SectionList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ChevronLeft, SearchIcon } from 'lucide-react-native'
import { Text } from '~/components/ui/text'
import { NotificationSection } from './components/NotificationSection'
import { BottomNavigation, ScreenName } from '~/components/Navigation/BottomNavigation'
import { Notification, NotificationSection as NotificationSectionType } from './types'
import * as Notifications from 'expo-notifications'
import { fetchNotifications } from './api'
import { formatDistanceToNow, parseISO, isToday, isYesterday, differenceInDays } from 'date-fns'

export default function NotificationsScreen() {
  const router = useRouter()
  const [notificationSections, setNotificationSections] = useState<NotificationSectionType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const groupNotificationsByDate = (notifications: Notification[]): NotificationSectionType[] => {
    const uniqueNotifications = new Map<number, Notification>();
    notifications.forEach(notification => {
      uniqueNotifications.set(notification.notification_id, notification);
    });

    const grouped = Array.from(uniqueNotifications.values()).reduce((acc, notification) => {
      const date = parseISO(notification.created_at);
      let group: string;

      if (isToday(date)) {
        group = 'Today';
      } else if (isYesterday(date)) {
        group = 'Yesterday';
      } else {
        const daysDifference = differenceInDays(new Date(), date);
        if (daysDifference <= 7) {
          group = `Last ${daysDifference} days`;
        } else {
          group = 'Older';
        }
      }

      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(notification);
      return acc;
    }, {} as Record<string, Notification[]>);

    Object.values(grouped).forEach(group => {
      group.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    const sectionOrder = ['Today', 'Yesterday', 'Last 2 days', 'Last 3 days', 'Last 4 days', 'Last 5 days', 'Last 6 days', 'Last 7 days', 'Older'];
    return sectionOrder
      .filter(section => grouped[section] && grouped[section].length > 0)
      .map(section => ({ title: section, data: grouped[section] }));
  };

  const loadNotifications = useCallback(async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true)
      setPage(5)
    } else {
      setIsLoading(true)
    }

    try {
      const { notifications: fetchedNotifications, hasMore: moreAvailable } = await fetchNotifications(refresh ? 1 : page)
      const newSections = groupNotificationsByDate(fetchedNotifications)
      
      setNotificationSections(prev => {
        if (refresh) return newSections;
        
        const mergedNotifications = new Map<number, Notification>();
        
        prev.forEach(section => {
          section.data.forEach(notification => {
            mergedNotifications.set(notification.notification_id, notification);
          });
        });
        
        newSections.forEach(section => {
          section.data.forEach(notification => {
            mergedNotifications.set(notification.notification_id, notification);
          });
        });
        
        return groupNotificationsByDate(Array.from(mergedNotifications.values()));
      });
      
      setHasMore(moreAvailable)
      if (!refresh) setPage(prev => prev + 1)
    } catch (error) {
      console.error('Failed to load notifications:', error)
      Alert.alert('Error', 'Failed to load notifications. Please try again later.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [page])

  useEffect(() => {
    loadNotifications()
    const subscription = Notifications.addNotificationReceivedListener(() => loadNotifications(true))
    return () => subscription.remove()
  }, [])

  const renderSectionHeader = ({ section }: { section: NotificationSectionType }) => (
    <Text style={styles.sectionTitle}>{section.title}</Text>
  )

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationSection
      section={{ title: '', data: [item] }}
    />
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.headertitle}>Notifications</Text>
          <SearchIcon />
      </View>

      <SectionList
        sections={notificationSections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.notification_id.toString()}
        contentContainerStyle={styles.contentContainer}
        onRefresh={() => loadNotifications(true)}
        refreshing={isRefreshing}
        onEndReached={() => hasMore && loadNotifications()}
        onEndReachedThreshold={0.1}
        stickySectionHeadersEnabled={false}
        ListFooterComponent={() => hasMore && <ActivityIndicator style={styles.loader} />}
        ListEmptyComponent={() => 
          !isLoading && (
            <Text style={styles.emptyText}>No notifications found</Text>
          )
        }
      />

      <View style={styles.yellowLine} />
      <BottomNavigation activeScreen={ScreenName.Notifications}/>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 10,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  yellowLine: {
    height: 4,
    backgroundColor: '#F3BC00',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#343474',
  },
  loader: {
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666666',
  },
  headertitle: {
    paddingTop: 13,
    height: '100%',
    width: '100%',
    color: '#343474',
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'left',
    textAlignVertical: 'center',
  }
})

