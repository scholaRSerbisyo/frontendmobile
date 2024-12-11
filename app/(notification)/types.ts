export interface Notification {
  id: string;
  title: string;
  body: string;
  data: {
    eventId: number;
    eventName: string;
    eventType: string;
    description: string;
    date: string;
    timeFrom: string;
    timeTo: string;
  };
}

export interface NotificationSection {
  title: string;
  data: Notification[];
}

