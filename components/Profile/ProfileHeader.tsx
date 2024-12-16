import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, GraduationCap, MapPin } from 'lucide-react-native';

interface ProfileHeaderProps {
  name: string;
  education: string;
  location: string;
  onBackPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, education, location, onBackPress }) => {
  return (
    <>
      <View style={styles.topSection}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <ChevronLeft stroke="white" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.bottomSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/96' }}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <GraduationCap stroke="#FFA500" width={16} height={16} />
            <Text style={styles.detailText}>
              Studied at <Text style={styles.detailBold}>{education}</Text>
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin stroke="#FFA500" width={16} height={16} />
            <Text style={styles.detailText}>
              Live in <Text style={styles.detailBold}>{location}</Text>
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topSection: {
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 24,
    paddingBottom: 64,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginTop: 20,
  },
  nameContainer: {
    position: 'absolute',
    bottom: 12,
    left: 140,
    right: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  divider: {
    height: 4,
    backgroundColor: '#FFA500',
  },
  bottomSection: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
  },
  profileImageContainer: {
    position: 'absolute',
    top: -48,
    left: 24,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: 'white',
    overflow: 'hidden',
    zIndex: 1,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    marginLeft: 116,
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  detailBold: {
    color: '#333',
    fontWeight: '500',
  },
});

export default ProfileHeader;

