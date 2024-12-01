export interface CalendarEvent {
  id: string
  date: string
  title: string
  location: string
  startTime: string
  endTime: string
  type: 'today' | 'upcoming' | 'previous'
  duration: string
}

export interface MarkedDate {
  marked?: boolean
  dotColor?: string
  selected?: boolean
  selectedColor?: string
}

export interface MarkedDates {
  [date: string]: MarkedDate
}

