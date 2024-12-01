export interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  replies?: {
    author: string
    content: string
    timestamp: string
  }[]
}

