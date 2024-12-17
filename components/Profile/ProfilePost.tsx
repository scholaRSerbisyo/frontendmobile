import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from '../ui/text';
import { getImageUrl } from '../services/imageService';
import { format } from 'date-fns';
import { Submission } from '~/app/(profile)/total-rs';

interface ProfilePostProps {
  submission: Submission;
}

export function ProfilePost({ submission }: ProfilePostProps) {
  const [timeInImage, setTimeInImage] = useState<string | null>(null);
  const [timeOutImage, setTimeOutImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        if (submission.submission_details.time_in_image_uuid) {
          const timeInUrl = await getImageUrl(submission.submission_details.time_in_image_uuid);
          setTimeInImage(timeInUrl);
        }
        if (submission.submission_details.time_out_image_uuid) {
          const timeOutUrl = await getImageUrl(submission.submission_details.time_out_image_uuid);
          setTimeOutImage(timeOutUrl);
        }
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [submission]);

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd/yyyy hh:mm a');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F3BC00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.postCard}>
        <Text style={styles.postTitle}>{submission.event.event_name}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{submission.event.date}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>
            {submission.event.time_from} - {submission.event.time_to}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{submission.event.location}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Type of RS:</Text>
          <Text style={styles.value}>{submission.event.event_Type.name}</Text>
        </View>

        <View style={styles.submissionDetails}>
          <Text style={styles.sectionTitle}>Submission Details</Text>
          
          <View style={styles.timeDetails}>
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>Time In:</Text>
              <Text style={styles.timeValue}>{formatDateTime(submission.submission_details.time_in)}</Text>
              <Text style={styles.locationText}>{submission.submission_details.time_in_location}</Text>
            </View>
            
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>Time Out:</Text>
              <Text style={styles.timeValue}>{formatDateTime(submission.submission_details.time_out)}</Text>
              <Text style={styles.locationText}>{submission.submission_details.time_out_location}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.description}>{submission.event.description}</Text>
        </View>

        <View style={styles.imagesContainer}>
          {timeInImage && (
            <View style={styles.imageBlock}>
              <Text style={styles.imageLabel}>Time In Photo</Text>
              <Image
                source={{ uri: timeInImage }}
                style={styles.postImage}
                resizeMode="cover"
              />
            </View>
          )}
          {timeOutImage && (
            <View style={styles.imageBlock}>
              <Text style={styles.imageLabel}>Time Out Photo</Text>
              <Image
                source={{ uri: timeOutImage }}
                style={styles.postImage}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343474',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#343474',
    fontWeight: '500',
    marginRight: 8,
    width: 80,
  },
  value: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  submissionDetails: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343474',
    marginBottom: 12,
  },
  timeDetails: {
    gap: 16,
  },
  timeBlock: {
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#343474',
  },
  timeValue: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  descriptionContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    lineHeight: 20,
  },
  imagesContainer: {
    gap: 16,
    marginTop: 12,
  },
  imageBlock: {
    flex: 1,
  },
  imageLabel: {
    fontSize: 14,
    color: '#343474',
    fontWeight: '500',
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});



// import React, { useState, useEffect } from 'react';
// import { View, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import { Text } from '../ui/text';
// import { getImageUrl } from '../services/imageService';
// import { format } from 'date-fns';

// interface Submission {
//   submission_id: number;
//   event: {
//     event_id: number;
//     event_name: string;
//     description: string;
//     date: string;
//     time_from: string;
//     time_to: string;
//     location: string;
//     status: string;
//     event_type: string;
//     school: string | null;
//     barangay: string | null;
//   };
//   submission_details: {
//     time_in: string;
//     time_out: string;
//     time_in_location: string;
//     time_out_location: string;
//     time_in_image_uuid: string;
//     time_out_image_uuid: string;
//   };
// }

// interface ProfilePostProps {
//   submission: Submission;
// }

// export function ProfilePost({ submission }: ProfilePostProps) {
//   const [timeInImage, setTimeInImage] = useState<string | null>(null);
//   const [timeOutImage, setTimeOutImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadImages = async () => {
//       try {
//         if (submission.submission_details.time_in_image_uuid) {
//           const timeInUrl = await getImageUrl(submission.submission_details.time_in_image_uuid);
//           setTimeInImage(timeInUrl);
//         }
//         if (submission.submission_details.time_out_image_uuid) {
//           const timeOutUrl = await getImageUrl(submission.submission_details.time_out_image_uuid);
//           setTimeOutImage(timeOutUrl);
//         }
//       } catch (error) {
//         console.error('Error loading images:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadImages();
//   }, [submission]);

//   const formatDateTime = (dateString: string) => {
//     return format(new Date(dateString), 'MM/dd/yyyy hh:mm a');
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#F3BC00" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.postCard}>
//         <Text style={styles.postTitle}>{submission.event.event_name}</Text>
        
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Date:</Text>
//           <Text style={styles.value}>{submission.event.date}</Text>
//         </View>
        
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Time:</Text>
//           <Text style={styles.value}>
//             {submission.event.time_from} - {submission.event.time_to}
//           </Text>
//         </View>
        
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Location:</Text>
//           <Text style={styles.value}>{submission.event.location}</Text>
//         </View>
        
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Type of RS:</Text>
//           <Text style={styles.value}>{submission.event.event_type}</Text>
//         </View>

//         <View style={styles.submissionDetails}>
//           <Text style={styles.sectionTitle}>Submission Details</Text>
          
//           <View style={styles.timeDetails}>
//             <View style={styles.timeBlock}>
//               <Text style={styles.timeLabel}>Time In:</Text>
//               <Text style={styles.timeValue}>{formatDateTime(submission.submission_details.time_in)}</Text>
//               <Text style={styles.locationText}>{submission.submission_details.time_in_location}</Text>
//             </View>
            
//             <View style={styles.timeBlock}>
//               <Text style={styles.timeLabel}>Time Out:</Text>
//               <Text style={styles.timeValue}>{formatDateTime(submission.submission_details.time_out)}</Text>
//               <Text style={styles.locationText}>{submission.submission_details.time_out_location}</Text>
//             </View>
//           </View>
//         </View>
        
//         <View style={styles.descriptionContainer}>
//           <Text style={styles.label}>Description:</Text>
//           <Text style={styles.description}>{submission.event.description}</Text>
//         </View>

//         <View style={styles.imagesContainer}>
//           {timeInImage && (
//             <View style={styles.imageBlock}>
//               <Text style={styles.imageLabel}>Time In Photo</Text>
//               <Image
//                 source={{ uri: timeInImage }}
//                 style={styles.postImage}
//                 resizeMode="cover"
//               />
//             </View>
//           )}
//           {timeOutImage && (
//             <View style={styles.imageBlock}>
//               <Text style={styles.imageLabel}>Time Out Photo</Text>
//               <Image
//                 source={{ uri: timeOutImage }}
//                 style={styles.postImage}
//                 resizeMode="cover"
//               />
//             </View>
//           )}
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//   },
//   postCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     margin: 16,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   postTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#343474',
//     marginBottom: 12,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   label: {
//     fontSize: 14,
//     color: '#343474',
//     fontWeight: '500',
//     marginRight: 8,
//     width: 80,
//   },
//   value: {
//     fontSize: 14,
//     color: '#666666',
//     flex: 1,
//   },
//   submissionDetails: {
//     marginTop: 16,
//     padding: 12,
//     backgroundColor: '#F8F8F8',
//     borderRadius: 8,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#343474',
//     marginBottom: 12,
//   },
//   timeDetails: {
//     gap: 16,
//   },
//   timeBlock: {
//     marginBottom: 8,
//   },
//   timeLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#343474',
//   },
//   timeValue: {
//     fontSize: 14,
//     color: '#666666',
//     marginTop: 4,
//   },
//   locationText: {
//     fontSize: 12,
//     color: '#888888',
//     marginTop: 2,
//   },
//   descriptionContainer: {
//     marginTop: 16,
//     marginBottom: 12,
//   },
//   description: {
//     fontSize: 14,
//     color: '#666666',
//     marginTop: 4,
//     lineHeight: 20,
//   },
//   imagesContainer: {
//     gap: 16,
//     marginTop: 12,
//   },
//   imageBlock: {
//     flex: 1,
//   },
//   imageLabel: {
//     fontSize: 14,
//     color: '#343474',
//     fontWeight: '500',
//     marginBottom: 8,
//   },
//   postImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 8,
//   },
// });

