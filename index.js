import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, setupNotifications } from './lib/pushNotifications';

function AppWrapper() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    setupNotifications();
    registerForPushNotificationsAsync().then(token => {
      console.log('Push token:', token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      // You can dispatch an action here to update your app's state
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // Handle notification interaction here
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

// Must be exported or Fast Refresh won't update the context
export function App() {
  return <AppWrapper />;
}

registerRootComponent(App);

