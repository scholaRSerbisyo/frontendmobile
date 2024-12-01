import { Event } from '../types/event'

export const mockEvents: Event[] = [
  {
    id: '1',
    title: "Scholar's Cup",
    date: '02/14/2024',
    startTime: '3pm',
    endTime: '5pm',
    location: '89 Hayes St, Cagayan de Oro, 9000, Misamis Oriental',
    type: 'CSO base',
    description: 'Fostering discipline, teamwork, leadership, respect, and time management. Building character through sports.',
    image: 'https://example.com/scholars-cup-banner.jpg', // This should be the URL from your database
    comments: 5
  },
  {
    id: '2',
    title: 'Barangay Youth Profiling',
    date: '02/14/2024',
    startTime: '11pm',
    endTime: '3pm',
    location: 'FLJP+98R, Mabolo St, Cagayan de Oro, 9000 Misamis Oriental',
    type: 'Community base',
    description: 'Cultural performances, games, and community development.',
    comments: 0
  }
]

