import { Notification, NotificationSection } from './types'

const now = new Date()
const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

export const notifications: NotificationSection[] = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        title: "Scholar's Cup",
        subtitle: 'Notif 1',
        timestamp: new Date(),
      },
      {
        id: '2',
        title: 'Kahupayan: Care Circle Kumustahan',
        subtitle: 'Notif 2',
        timestamp: new Date(),
      },
    ],
  },
  {
    title: 'Last 7 days',
    data: [
      {
        id: '3',
        title: 'Huguyhuguy',
        subtitle: 'Notif 4',
        timestamp: sevenDaysAgo,
      },
      {
        id: '4',
        title: "That's a wrap",
        subtitle: 'Notif 5',
        timestamp: sevenDaysAgo,
      },
      {
        id: '5',
        title: 'ISDA Journey to the Shore',
        subtitle: 'Notif 6',
        timestamp: sevenDaysAgo,
      },
      {
        id: '6',
        title: 'Barangay Youth Profiling',
        subtitle: 'Notif 7',
        timestamp: sevenDaysAgo,
      },
    ],
  },
  {
    title: 'Last 30 days',
    data: [
      {
        id: '7',
        title: 'PamiNOW: FiCom-TiMe',
        subtitle: 'Notif 7',
        timestamp: thirtyDaysAgo,
      },
    ],
  },
]

