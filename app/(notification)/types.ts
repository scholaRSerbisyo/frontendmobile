export interface Notification {
  id: string
  title: string
  subtitle: string
  avatar?: string
  timestamp: Date
}

export interface NotificationSection {
  title: string
  data: Notification[]
}

