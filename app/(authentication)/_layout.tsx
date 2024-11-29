import React from 'react';
import { AuthProvider } from '~/components/Authentication/api/Auth';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
          animation: 'fade',
        }}
      />
    </AuthProvider>
  );
}

