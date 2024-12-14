import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { Notification } from '../types';
import { NotificationItem } from './NotificationItem';

interface NotificationListProps {
  notifications: Notification[];
  onNotificationPress: (notification: Notification) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ notifications, onNotificationPress }) => {
  const renderItem = ({ item }: ListRenderItemInfo<Notification>) => (
    <NotificationItem
      notification={item}
      onPress={() => onNotificationPress(item)}
    />
  );

  const keyExtractor = (item: Notification) => item.notification_id.toString();

  return (
    <FlatList
      data={notifications}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

