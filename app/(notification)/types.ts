export interface Notification {
  notification_id: number;
  event_id: number;
  event_name: string;
  description: string;
  event_image_uuid: string;
  event_type_name: string;
  date: string;
  time_from: string;
  time_to: string;
  created_at: string;
  read: boolean;
}

export interface NotificationSection {
  title: string;
  data: Notification[];
}

