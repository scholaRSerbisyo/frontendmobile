export interface Submission {
  submission_id: number;
  event: {
    event_id: number;
    event_name: string;
    description: string;
    date: string;
    time_from: string;
    time_to: string;
    location: string;
    status: string;
    event_type: string;
    school: string | null;
    barangay: string | null;
  };
  submission_details: {
    time_in: string;
    time_out: string;
    time_in_location: string;
    time_out_location: string;
    time_in_image_uuid: string;
    time_out_image_uuid: string;
  };
}

