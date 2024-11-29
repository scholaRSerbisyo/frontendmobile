import React from 'react'
import { useAuth } from './Authentication/api/AuthContext'
import { Redirect } from 'expo-router'

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Redirect href="/(authentication)/login" />
  }

  return <>{children}</>
}

