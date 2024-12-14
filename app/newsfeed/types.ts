export interface Scholar {
    scholar_id: number;
    firstname: string;
    lastname: string;
  }
  
  export interface Comment {
    comment_id: number;
    comment_text: string;
    event_id: number;
    scholar_id: number;
    created_at: string;
    updated_at: string;
    scholar: Scholar;
  }
  
  export interface Reply {
    reply_id: number;
    reply_text: string;
    comment_id: number;
    scholar_id: number;
    created_at: string;
    updated_at: string;
    scholar: Scholar;
  }
  
  export interface Event {
    event_id: number;
    event_name: string;
    description: string;
    date: string;
    time_from: string;
    time_to: string;
    location: string;
    event_type: {
      id: number;
      name: string;
    };
    school?: {
      id: number;
      name: string;
    };
    barangay?: {
      id: number;
      name: string;
    };
    event_image_uuid: string;
    created_at: string;
    updated_at: string;
  }
  
  