// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Api from '../services/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    console.log('Fetching user profile...');
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        console.log(token);
        const response = await axios.get(Api.get_auth_profile, {
          headers: {
            Authorization: `${token}`,
          },
        });
        console.log(response.data);
        setUserProfile(response.data.user_info);
      } catch (error) {
        console.error('Error fetching user profile:', error.message || error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile.</Text>
      </View>
    );
  }

  const { user, phone_no, date_of_birth, gender, profile_pic, address, bio } =
    userProfile;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Picture */}
      <View style={styles.profilePicContainer}>
        <Image
          source={{ uri: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png' }} style={styles.profilePic}
        />
      </View>

      {/* Full Name */}
      <Text style={styles.name}>
        {user.first_name} {user.last_name}
      </Text>

      {/* Username */}
      <Text style={styles.username}>@{user.username}</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* User Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{phone_no || 'Not provided'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Date of Birth:</Text>
          <Text style={styles.infoValue}>{date_of_birth || 'Not provided'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Gender:</Text>
          <Text style={styles.infoValue}>{gender || 'Not provided'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{address || 'Not provided'}</Text>
        </View>
      </View>

      {/* Bio Section */}
      <View style={styles.bioSection}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.bioText}>{bio || 'No bio available'}</Text>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff', // White background
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 18,
    color: '#666666',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c', // Red text for errors
  },
  profilePicContainer: {
    marginBottom: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75, // Circular profile picture
    borderWidth: 3,
    borderColor: '#3b82f6', // Blue border
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333', // Dark gray text
    marginBottom: 8,
  },
  username: {
    fontSize: 20,
    color: '#3b82f6', // Blue text for username
    marginBottom: 16,
  },
  divider: {
    height: 1,
    width: '80%',
    backgroundColor: '#e0e0e0', // Light gray divider
    marginVertical: 20,
  },
  infoSection: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666666', // Lighter gray text
  },
  infoValue: {
    fontSize: 16,
    color: '#333333', // Dark gray text
    fontWeight: '500',
  },
  bioSection: {
    width: '100%',
    marginBottom: 20,
  },
  bioText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  editButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});