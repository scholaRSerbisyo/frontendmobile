export interface Event {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  type: 'CSO base' | 'Community base'
  description: string
  image?: string
  comments?: number
}

