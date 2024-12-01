import { CalendarEvent } from '../types/calendar'

export const mockEvents: { [key: string]: CalendarEvent } = {
  '2024-01-07': {
    id: '1',
    date: '2024-01-07',
    title: 'Previous Return Service',
    location: 'City Library',
    startTime: '9:00 AM',
    endTime: '9:30 AM',
    type: 'previous',
    duration: '30min'
  },
  '2024-01-10': {
    id: '2',
    date: '2024-01-10',
    title: 'Previous Return Service',
    location: 'Community Center',
    startTime: '2:00 PM',
    endTime: '2:30 PM',
    type: 'previous',
    duration: '30min'
  },
  '2024-01-12': {
    id: '3',
    date: '2024-01-12',
    title: "Today's Return Service",
    location: 'City Hall',
    startTime: '10:00 AM',
    endTime: '10:30 AM',
    type: 'today',
    duration: '30min'
  },
  '2024-01-15': {
    id: '4',
    date: '2024-01-15',
    title: 'Upcoming Return Service',
    location: 'Main Campus',
    startTime: '1:00 PM',
    endTime: '2:00 PM',
    type: 'upcoming',
    duration: '60min'
  },
  '2024-01-21': {
    id: '5',
    date: '2024-01-21',
    title: 'Upcoming Return Service',
    location: 'Sports Complex',
    startTime: '3:00 PM',
    endTime: '4:00 PM',
    type: 'upcoming',
    duration: '60min'
  },
  '2024-01-24': {
    id: '6',
    date: '2024-01-24',
    title: 'Upcoming Return Service',
    location: 'Student Center',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    type: 'upcoming',
    duration: '60min'
  },
  '2024-01-31': {
    id: '7',
    date: '2024-01-31',
    title: 'Upcoming Return Service',
    location: 'Admin Building',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    type: 'upcoming',
    duration: '60min'
  }
}

